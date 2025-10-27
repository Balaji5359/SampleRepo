import json
import base64
import time
import logging
import boto3
import uuid
logger = logging.getLogger()
logger.setLevel(logging.INFO)

REGION = "ap-south-1"
AUDIO_BUCKET = "students-recording-communication-activities-startup"
TRANSCRIBE_BUCKET = "students-recording-communication-activities-transcribe-startup"

s3 = boto3.client("s3", region_name=REGION)
transcribe = boto3.client("transcribe", region_name=REGION)

def lambda_handler(event, context):
    try:
        # Debug logging
        logger.info(f"Event: {json.dumps(event)}")
        
        # Handle different event structures
        body = event.get("body", "{}")
        if isinstance(body, str):
            data = json.loads(body)
        else:
            data = body
            
        logger.info(f"Parsed data: {json.dumps({k: v[:50] + '...' if k == 'data' and len(str(v)) > 50 else v for k, v in data.items()})}")
        
        # Extract audio and sessionId
        audio_base64 = data.get("data")
        session_id = data.get("sessionId", str(uuid.uuid4()))

        if not audio_base64:
            logger.error(f"No audio data found. Data keys: {list(data.keys())}")
            return {
                "statusCode": 400, 
                "body": json.dumps({"error": "No audio data provided", "received_keys": list(data.keys())}),
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "POST, OPTIONS"
                }
            }

        # Detect format
        if audio_base64.startswith("GkXf"):
            filename = f"{session_id}.webm"
            media_format = "webm"
        else:
            filename = f"{session_id}.mp4"
            media_format = "mp4"

        # Upload audio to S3
        audio_bytes = base64.b64decode(audio_base64)
        s3.put_object(Bucket=AUDIO_BUCKET, Key=filename, Body=audio_bytes, ContentType=f"audio/{media_format}")

        # Start Transcribe job
        job_name = f"transcribe-{session_id}"
        s3_uri = f"s3://{AUDIO_BUCKET}/{filename}"
        transcribe.start_transcription_job(
            TranscriptionJobName=job_name,
            LanguageCode="en-IN",
            Media={"MediaFileUri": s3_uri},
            MediaFormat=media_format,
            OutputBucketName=TRANSCRIBE_BUCKET
        )

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Transcription started",
                "sessionId": session_id,
                "jobName": job_name
            }),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            }
        }

    except Exception as e:
        logger.error(str(e), exc_info=True)
        return {
            "statusCode": 500, 
            "body": json.dumps({"error": str(e)}),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            }
        }

