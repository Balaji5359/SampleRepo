import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        # Log the entire event to see what API Gateway is sending
        logger.info(f"Full event received: {json.dumps(event, default=str)}")
        
        # Check different ways the body might be passed
        body = event.get("body")
        logger.info(f"Raw body: {body}")
        logger.info(f"Body type: {type(body)}")
        
        if event.get("isBase64Encoded"):
            logger.info("Body is base64 encoded")
            import base64
            body = base64.b64decode(body).decode("utf-8")
            logger.info(f"Decoded body: {body[:200]}...")
        
        if body:
            try:
                data = json.loads(body)
                logger.info(f"Parsed JSON data: {data}")
                logger.info(f"SessionId from data: {data.get('sessionId')}")
                logger.info(f"Data keys: {list(data.keys())}")
                
                return {
                    "statusCode": 200,
                    "body": json.dumps({
                        "message": "Test successful",
                        "receivedSessionId": data.get('sessionId'),
                        "receivedDataLength": len(data.get('data', '')),
                        "allKeys": list(data.keys())
                    }),
                    "headers": {"Content-Type": "application/json"}
                }
            except json.JSONDecodeError as e:
                logger.error(f"JSON decode error: {str(e)}")
                return {
                    "statusCode": 400,
                    "body": json.dumps({"error": f"JSON decode error: {str(e)}"}),
                    "headers": {"Content-Type": "application/json"}
                }
        else:
            logger.error("No body received")
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "No body received", "event_keys": list(event.keys())}),
                "headers": {"Content-Type": "application/json"}
            }
            
    except Exception as e:
        logger.error(f"Lambda error: {str(e)}", exc_info=True)
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {"Content-Type": "application/json"}
        }