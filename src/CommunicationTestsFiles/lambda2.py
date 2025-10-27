import json
import boto3
import logging
from datetime import datetime, timezone

logger = logging.getLogger()
logger.setLevel(logging.INFO)

REGION = "ap-south-1"
TRANSCRIBE_BUCKET = "students-recording-communication-activities-transcribe-startup"
DDB_TABLE = "JAMTest-Database"

s3 = boto3.client("s3", region_name=REGION)
dynamodb = boto3.resource("dynamodb", region_name=REGION)
table = dynamodb.Table(DDB_TABLE)

def lambda_handler(event, context):
    try:
        # Parse request body
        body = event.get("body", "{}")
        if isinstance(body, str):
            body = json.loads(body)
        session_id = body.get("sessionId")
        if not session_id:
            return {"statusCode": 400, "body": json.dumps({"error": "sessionId required"})}

        # Assume standard S3 key format
        key = f"transcribe-{session_id}.json"
        s3_uri = f"s3://{TRANSCRIBE_BUCKET}/{key}"

        # Fetch transcript JSON
        obj = s3.get_object(Bucket=TRANSCRIBE_BUCKET, Key=key)
        transcript_json = json.loads(obj["Body"].read())

        # Flatten transcript text
        transcripts = transcript_json.get("results", {}).get("transcripts", [])
        transcript_text = "\n".join([t.get("transcript", "") for t in transcripts]).strip()

        # Write metadata to DynamoDB
        table.put_item(Item={
            "sessionId": session_id,
            "transcriptS3Uri": s3_uri,
            "transcriptText": transcript_text,
            "fetchedAt": datetime.now(timezone.utc).isoformat(),
            "status": "AVAILABLE"
        })

        # Return response
        return {
            "statusCode": 200,
            "body": json.dumps({
                "status": "completed",
                "sessionId": session_id,
                # "s3_uri": s3_uri,
                "transcript": transcript_text
            }),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            }
        }

    except s3.exceptions.NoSuchKey:
        return {"statusCode": 404, "body": json.dumps({"error": "Transcript JSON not found", "sessionId": session_id})}
    except Exception as e:
        logger.exception("Unhandled exception")
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
