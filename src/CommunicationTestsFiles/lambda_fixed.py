# lambda_function.py
import os
import json
import base64
import time
import logging
import boto3
from datetime import datetime, timezone

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Environment variables
S3_BUCKET = "students-recording-communication-activities-startup"
DDB_TABLE = "JAMTest-Database"
REGION = "ap-south-1"
TRANSCRIBE_POLL_MAX_SECONDS = 180
TRANSCRIBE_POLL_INTERVAL = 4

s3 = boto3.client("s3", region_name=REGION)
dynamodb = boto3.client("dynamodb", region_name=REGION)
transcribe = boto3.client("transcribe", region_name=REGION)


def iso_now():
    return datetime.now(timezone.utc).isoformat()


def lambda_handler(event, context):
    try:
        logger.info(f"Received event: {json.dumps(event)}")
        
        # --- Parse input ---
        body = event.get("body") or "{}"
        if event.get("isBase64Encoded"):
            body = base64.b64decode(body).decode("utf-8")
        
        logger.info(f"Body type: {type(body)}, Body content: {body[:200]}...")
        
        data = json.loads(body)
        session_id = data.get("sessionId")
        audio_base64 = data.get("data")
        filename = f"{session_id}.wav"  # Use sessionId as filename
        content_type = data.get("contentType") or "audio/wav"

        logger.info(f"Parsed data - sessionId: {session_id}, audio_data_length: {len(audio_base64) if audio_base64 else 0}")

        if not session_id or not audio_base64:
            error_msg = f"Missing sessionId: {not session_id}, Missing audio data: {not audio_base64}"
            logger.error(error_msg)
            return {
                "statusCode": 400, 
                "body": json.dumps({"error": "Missing sessionId or audio data", "details": error_msg}),
                "headers": {"Content-Type": "application/json"}
            }

        audio_bytes = base64.b64decode(audio_base64)
        logger.info(f"Decoded audio bytes length: {len(audio_bytes)}")

        # --- Upload to S3 ---
        s3.put_object(Bucket=S3_BUCKET, Key=filename, Body=audio_bytes, ContentType=content_type)
        s3_uri = f"s3://{S3_BUCKET}/{filename}"
        logger.info(f"Uploaded to S3: {s3_uri}")

        # --- Check if sessionId exists in DynamoDB ---
        try:
            existing_item = dynamodb.get_item(
                TableName=DDB_TABLE,
                Key={"sessionId": {"S": session_id}}
            )
            
            if "Item" in existing_item:
                # Update existing record with S3 link
                dynamodb.update_item(
                    TableName=DDB_TABLE,
                    Key={"sessionId": {"S": session_id}},
                    UpdateExpression="SET s3Bucket=:bucket, s3Key=:key, uploadedAt=:uploaded, #s=:status",
                    ExpressionAttributeNames={"#s": "status"},
                    ExpressionAttributeValues={
                        ":bucket": {"S": S3_BUCKET},
                        ":key": {"S": filename},
                        ":uploaded": {"S": iso_now()},
                        ":status": {"S": "UPLOADED"}
                    }
                )
                logger.info(f"Updated existing DynamoDB record for sessionId: {session_id}")
            else:
                # Create new record
                dynamodb.put_item(TableName=DDB_TABLE, Item={
                    "sessionId": {"S": session_id},
                    "s3Bucket": {"S": S3_BUCKET},
                    "s3Key": {"S": filename},
                    "uploadedAt": {"S": iso_now()},
                    "status": {"S": "UPLOADED"}
                })
                logger.info(f"Created new DynamoDB record for sessionId: {session_id}")
        except Exception as db_error:
            logger.error(f"DynamoDB error: {str(db_error)}")
            # Continue with transcription even if DynamoDB fails

        # --- Start Transcribe job ---
        job_name = f"transcribe-{session_id}-{int(time.time())}"
        
        # Detect actual audio format
        if audio_base64.startswith('GkXf'):  # WebM signature
            media_format = "webm"
            filename = f"{session_id}.webm"
        else:
            media_format = "mp4"  # Fallback for other formats
            filename = f"{session_id}.mp4"
        
        # Re-upload with correct format
        s3.put_object(Bucket=S3_BUCKET, Key=filename, Body=audio_bytes, ContentType=f"audio/{media_format}")
        s3_uri = f"s3://{S3_BUCKET}/{filename}"
        
        logger.info(f"Starting transcribe job: {job_name} with format: {media_format}")
        
        transcribe.start_transcription_job(
            TranscriptionJobName=job_name,
            LanguageCode="en-IN",
            Media={"MediaFileUri": s3_uri},
            MediaFormat=media_format
        )

        # --- Poll until completed ---
        start_time = time.time()
        transcript_text = ""
        while True:
            job = transcribe.get_transcription_job(TranscriptionJobName=job_name)
            status = job["TranscriptionJob"]["TranscriptionJobStatus"]
            logger.info(f"Transcribe job status: {status}")
            
            if status == "COMPLETED":
                transcript_uri = job["TranscriptionJob"]["Transcript"]["TranscriptFileUri"]
                logger.info(f"Transcript URI: {transcript_uri}")
                
                # Fetch transcript JSON from S3 using boto3
                s3_transcribe = boto3.client("s3")
                bucket_name = transcript_uri.split("/")[2]
                key_name = "/".join(transcript_uri.split("/")[3:])
                obj = s3_transcribe.get_object(Bucket=bucket_name, Key=key_name)
                tj = json.loads(obj["Body"].read())
                transcript_text = "\n".join([t.get("transcript", "") for t in tj.get("results", {}).get("transcripts", [])])
                logger.info(f"Extracted transcript: {transcript_text}")
                break
            elif status in ("FAILED", "ERROR"):
                logger.error(f"Transcription failed with status: {status}")
                return {
                    "statusCode": 500, 
                    "body": json.dumps({"error": "Transcription failed", "status": status}),
                    "headers": {"Content-Type": "application/json"}
                }
            elif time.time() - start_time > TRANSCRIBE_POLL_MAX_SECONDS:
                logger.warning("Transcription timeout")
                return {
                    "statusCode": 202, 
                    "body": json.dumps({"message": "Transcription pending", "jobId": job_name}),
                    "headers": {"Content-Type": "application/json"}
                }
            time.sleep(TRANSCRIBE_POLL_INTERVAL)

        # --- Update DynamoDB with transcript ---
        try:
            dynamodb.update_item(
                TableName=DDB_TABLE,
                Key={"sessionId": {"S": session_id}},
                UpdateExpression="SET #s=:s, transcript=:t, transcribeJobId=:j, transcribedAt=:ts, s3Link=:link",
                ExpressionAttributeNames={"#s": "status"},
                ExpressionAttributeValues={
                    ":s": {"S": "COMPLETED"},
                    ":t": {"S": transcript_text},
                    ":j": {"S": job_name},
                    ":ts": {"S": iso_now()},
                    ":link": {"S": s3_uri}
                }
            )
            logger.info(f"Updated DynamoDB with transcript and S3 link")
        except Exception as update_error:
            logger.error(f"Failed to update DynamoDB with transcript: {str(update_error)}")

        # --- Generate presigned URL ---
        presigned_url = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": S3_BUCKET, "Key": filename},
            ExpiresIn=3600
        )

        response_data = {
            "sessionId": session_id,
            "s3Key": filename,
            "s3Bucket": S3_BUCKET,
            "transcribeJobId": job_name,
            "transcript": transcript_text,
            "presignedGet": presigned_url
        }
        
        logger.info(f"Returning response: {response_data}")

        return {
            "statusCode": 200,
            "body": json.dumps(response_data),
            "headers": {"Content-Type": "application/json"}
        }

    except Exception as e:
        logger.error(f"Lambda error: {str(e)}", exc_info=True)
        return {
            "statusCode": 500, 
            "body": json.dumps({"error": str(e)}),
            "headers": {"Content-Type": "application/json"}
        }