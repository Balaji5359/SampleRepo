import json
import boto3
import razorpay
import hmac
import hashlib
from datetime import datetime, timedelta

dynamodb = boto3.resource("dynamodb")

ADMIN_TABLE = dynamodb.Table("SkillRoute_Admin")
STUDENT_TABLE = dynamodb.Table("SkillRoute_StudentDatabase")

PLAN_PRICES = {
    "monthly": 9900,
    "quarterly": 24900,
    "yearly": 79900
}

PLAN_DAYS = {
    "monthly": 30,
    "quarterly": 90,
    "yearly": 365
}

# ---------- SAFE BODY PARSER ----------
def parse_body(event):
    body = event.get("body")
    if body is None:
        return {}
    if isinstance(body, str):
        return json.loads(body)
    return body

# ---------- MAIN HANDLER ----------
def lambda_handler(event, context):
    try:
        body = parse_body(event)
        action = body.get("action")

        if action == "create_order":
            return create_order(body)

        if action == "verify_payment":
            return verify_payment(body)

        return response(400, "Invalid action")

    except Exception as e:
        return response(500, str(e))


# ---------- CREATE ORDER ----------
def create_order(body):
    college_email = body.get("college_email")
    plan_type = body.get("plan_type")

    if not college_email or not plan_type:
        return response(400, "college_email and plan_type required")

    amount = PLAN_PRICES.get(plan_type)
    if not amount:
        return response(400, "Invalid plan_type")

    config = ADMIN_TABLE.get_item(
        Key={"admin_id": "skillroute-balaji28"}
    )["Item"]

    client = razorpay.Client(
        auth=(config["key_id"], config["key_secret"])
    )

    order = client.order.create({
        "amount": amount,
        "currency": "INR",
        "payment_capture": 1,
        "notes": {
            "college_email": college_email,
            "plan_type": plan_type
        }
    })

    return {
        "statusCode": 200,
        "headers": cors(),
        "body": json.dumps({
            "order_id": order["id"],
            "razorpay_key": config["key_id"],
            "amount": amount,
            "currency": "INR"
        })
    }


# ---------- VERIFY PAYMENT & UPDATE DB ----------
def verify_payment(body):
    college_email = body.get("college_email")
    plan_type = body.get("plan_type")
    payment_id = body.get("razorpay_payment_id")
    order_id = body.get("razorpay_order_id")
    signature = body.get("razorpay_signature")

    if not all([college_email, plan_type, payment_id, order_id, signature]):
        return response(400, "Missing payment fields")

    config = ADMIN_TABLE.get_item(
        Key={"admin_id": "skillroute-balaji28"}
    )["Item"]

    secret = config["key_secret"]
    message = f"{order_id}|{payment_id}"

    expected_signature = hmac.new(
        secret.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()

    if expected_signature != signature:
        return response(400, "Payment verification failed")

    today = datetime.utcnow().date()
    expiry_date = today + timedelta(days=PLAN_DAYS[plan_type])

    STUDENT_TABLE.update_item(
        Key={"college_email": college_email},
        UpdateExpression="""
            SET user_type = :u,
                premium_plan = :p,
                premium_start_date = :sd,
                premium_expiry_date = :ed,
                payment_id = :pid,
                order_id = :oid,
                payment_status = :ps
        """,
        ExpressionAttributeValues={
            ":u": "premium",
            ":p": plan_type,
            ":sd": str(today),
            ":ed": str(expiry_date),
            ":pid": payment_id,
            ":oid": order_id,
            ":ps": "success"
        }
    )

    return response(200, "Premium activated successfully")


# ---------- HELPERS ----------
def response(code, msg):
    return {
        "statusCode": code,
        "headers": cors(),
        "body": json.dumps(msg)
    }

def cors():
    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "POST,OPTIONS"
    }
