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
        # --- Parse input ---
        body = event.get("body") or "{}"
        if event.get("isBase64Encoded"):
            body = base64.b64decode(body).decode("utf-8")
        data = json.loads(body)
        session_id = data.get("sessionId")
        audio_base64 = data.get("data")
        filename = data.get("filename") or f"{session_id}.wav"
        content_type = data.get("contentType") or "audio/wav"

        if not session_id or not audio_base64:
            return {"statusCode": 400, "body": json.dumps({"error": "Missing sessionId or audio data"})}

        audio_bytes = base64.b64decode(audio_base64)

        # --- Upload to S3 ---
        s3.put_object(Bucket=S3_BUCKET, Key=filename, Body=audio_bytes, ContentType=content_type)
        s3_uri = f"s3://{S3_BUCKET}/{filename}"

        # --- Record in DynamoDB ---
        dynamodb.put_item(TableName=DDB_TABLE, Item={
            "sessionId": {"S": session_id},
            "s3Bucket": {"S": S3_BUCKET},
            "s3Key": {"S": filename},
            "uploadedAt": {"S": iso_now()},
            "status": {"S": "UPLOADED"}
        })

        # --- Start Transcribe job ---
        job_name = f"transcribe-{session_id}-{int(time.time())}"
        media_format = filename.split(".")[-1]
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
            if status == "COMPLETED":
                transcript_uri = job["TranscriptionJob"]["Transcript"]["TranscriptFileUri"]
                # Fetch transcript JSON from S3 using boto3
                s3_transcribe = boto3.client("s3")
                bucket_name = transcript_uri.split("/")[2]
                key_name = "/".join(transcript_uri.split("/")[3:])
                obj = s3_transcribe.get_object(Bucket=bucket_name, Key=key_name)
                tj = json.loads(obj["Body"].read())
                transcript_text = "\n".join([t.get("transcript", "") for t in tj.get("results", {}).get("transcripts", [])])
                break
            elif status in ("FAILED", "ERROR"):
                return {"statusCode": 500, "body": json.dumps({"error": "Transcription failed"})}
            elif time.time() - start_time > TRANSCRIBE_POLL_MAX_SECONDS:
                return {"statusCode": 202, "body": json.dumps({"message": "Transcription pending", "jobId": job_name})}
            time.sleep(TRANSCRIBE_POLL_INTERVAL)

        # --- Update DynamoDB with transcript ---
        dynamodb.update_item(
            TableName=DDB_TABLE,
            Key={"sessionId": {"S": session_id}},
            UpdateExpression="SET #s=:s, transcript=:t, transcribeJobId=:j, transcribedAt=:ts",
            ExpressionAttributeNames={"#s": "status"},
            ExpressionAttributeValues={
                ":s": {"S": "COMPLETED"},
                ":t": {"S": transcript_text},
                ":j": {"S": job_name},
                ":ts": {"S": iso_now()}
            }
        )

        # --- Generate presigned URL ---
        presigned_url = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": S3_BUCKET, "Key": filename},
            ExpiresIn=3600
        )

        return {
            "statusCode": 200,
            "body": json.dumps({
                "sessionId": session_id,
                "s3Key": filename,
                "s3Bucket": S3_BUCKET,
                "transcribeJobId": job_name,
                "transcript": transcript_text,
                "presignedGet": presigned_url
            }),
            "headers": {"Content-Type": "application/json"}
        }

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
