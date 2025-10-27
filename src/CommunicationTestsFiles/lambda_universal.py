import json
import base64
import time
import logging
import boto3
from datetime import datetime, timezone

logger = logging.getLogger()
logger.setLevel(logging.INFO)

S3_BUCKET = "students-recording-communication-activities-startup"
DDB_TABLE = "JAMTest-Database"
REGION = "ap-south-1"

s3 = boto3.client("s3", region_name=REGION)
dynamodb = boto3.client("dynamodb", region_name=REGION)
transcribe = boto3.client("transcribe", region_name=REGION)

def lambda_handler(event, context):
    try:
        logger.info(f"Raw event: {json.dumps(event, default=str)}")
        
        # Extract data from different API Gateway configurations
        session_id = None
        audio_base64 = None
        
        # Method 1: Lambda Proxy Integration
        if "body" in event and event["body"]:
            try:
                body = event["body"]
                if event.get("isBase64Encoded"):
                    body = base64.b64decode(body).decode("utf-8")
                data = json.loads(body)
                session_id = data.get("sessionId")
                audio_base64 = data.get("data")
                logger.info("Method 1: Proxy integration - SUCCESS")
            except:
                logger.info("Method 1: Proxy integration - FAILED")
        
        # Method 2: Direct event data
        if not session_id and "sessionId" in event:
            session_id = event.get("sessionId")
            audio_base64 = event.get("data")
            logger.info("Method 2: Direct event - SUCCESS")
        
        # Method 3: Nested in event
        if not session_id:
            for key, value in event.items():
                if isinstance(value, dict) and "sessionId" in value:
                    session_id = value.get("sessionId")
                    audio_base64 = value.get("data")
                    logger.info(f"Method 3: Nested in {key} - SUCCESS")
                    break
        
        logger.info(f"Final extracted - sessionId: {session_id}, audio_length: {len(audio_base64) if audio_base64 else 0}")
        
        if not session_id or not audio_base64:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "error": "Missing sessionId or audio data",
                    "details": f"sessionId: {session_id}, audio_data: {bool(audio_base64)}",
                    "event_keys": list(event.keys())
                }),
                "headers": {"Content-Type": "application/json"}
            }
        
        # Process audio
        audio_bytes = base64.b64decode(audio_base64)
        
        # Detect format and set filename
        if audio_base64.startswith('GkXf'):
            filename = f"{session_id}.webm"
            media_format = "webm"
        else:
            filename = f"{session_id}.mp4"
            media_format = "mp4"
        
        # Upload to S3
        s3.put_object(
            Bucket=S3_BUCKET, 
            Key=filename, 
            Body=audio_bytes, 
            ContentType=f"audio/{media_format}"
        )
        s3_uri = f"s3://{S3_BUCKET}/{filename}"
        
        # Start transcription
        job_name = f"transcribe-{session_id}-{int(time.time())}"
        transcribe.start_transcription_job(
            TranscriptionJobName=job_name,
            LanguageCode="en-IN",
            Media={"MediaFileUri": s3_uri},
            MediaFormat=media_format
        )
        
        # Wait for completion (simplified)
        for _ in range(30):  # Max 2 minutes
            job = transcribe.get_transcription_job(TranscriptionJobName=job_name)
            status = job["TranscriptionJob"]["TranscriptionJobStatus"]
            
            if status == "COMPLETED":
                transcript_uri = job["TranscriptionJob"]["Transcript"]["TranscriptFileUri"]
                logger.info(f"Transcript URI: {transcript_uri}")
                
                try:
                    # Try direct HTTP access to transcript URI
                    import urllib.request
                    with urllib.request.urlopen(transcript_uri) as response:
                        tj = json.loads(response.read().decode())
                    transcript_text = "\n".join([t.get("transcript", "") for t in tj.get("results", {}).get("transcripts", [])])
                    
                    if not transcript_text:
                        transcript_text = "No speech detected in audio"
                        
                except Exception as http_error:
                    logger.error(f"HTTP access error: {str(http_error)}")
                    # Fallback: return a success message without transcript
                    transcript_text = f"Audio processed successfully. Job ID: {job_name}"
                
                return {
                    "statusCode": 200,
                    "body": json.dumps({
                        "sessionId": session_id,
                        "transcript": transcript_text,
                        "s3Key": filename
                    }),
                    "headers": {"Content-Type": "application/json"}
                }
            elif status in ("FAILED", "ERROR"):
                return {
                    "statusCode": 500,
                    "body": json.dumps({"error": "Transcription failed"}),
                    "headers": {"Content-Type": "application/json"}
                }
            
            time.sleep(4)
        
        return {
            "statusCode": 202,
            "body": json.dumps({"message": "Transcription timeout"}),
            "headers": {"Content-Type": "application/json"}
        }
        
    except Exception as e:
        logger.error(f"Error: {str(e)}", exc_info=True)
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {"Content-Type": "application/json"}
        }