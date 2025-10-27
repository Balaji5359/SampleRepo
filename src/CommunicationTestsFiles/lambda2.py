import json
import boto3
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

REGION = "ap-south-1"
DDB_TABLE = "JAMTest-Database"

s3 = boto3.client("s3", region_name=REGION)
dynamodb = boto3.resource("dynamodb", region_name=REGION)
table = dynamodb.Table(DDB_TABLE)
transcribe = boto3.client("transcribe", region_name=REGION)

def lambda_handler(event, context):
    try:
        # Handle API Gateway request
        data = json.loads(event.get("body", "{}"))
        session_id = data.get("sessionId")
        
        if not session_id:
            return {
                "statusCode": 400, 
                "body": json.dumps({"error": "SessionId required"}),
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "POST, OPTIONS"
                }
            }
        
        # Check transcription job status
        job_name = f"transcribe-{session_id}"
        try:
            response = transcribe.get_transcription_job(TranscriptionJobName=job_name)
            status = response['TranscriptionJob']['TranscriptionJobStatus']
            
            if status == 'COMPLETED':
                # Get transcript from S3
                transcript_uri = response['TranscriptionJob']['Transcript']['TranscriptFileUri']
                bucket = transcript_uri.split('/')[2].split('.')[0]
                key = '/'.join(transcript_uri.split('/')[3:])
                
                obj = s3.get_object(Bucket=bucket, Key=key)
                transcript_json = json.loads(obj["Body"].read())
                transcript_text = "\n".join([t.get("transcript", "") for t in transcript_json.get("results", {}).get("transcripts", [])])
                
                return {
                    "statusCode": 200, 
                    "body": json.dumps({"transcript": transcript_text, "status": "completed"}),
                    "headers": {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "Content-Type",
                        "Access-Control-Allow-Methods": "POST, OPTIONS"
                    }
                }
            else:
                return {
                    "statusCode": 202, 
                    "body": json.dumps({"status": status}),
                    "headers": {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "Content-Type",
                        "Access-Control-Allow-Methods": "POST, OPTIONS"
                    }
                }
                
        except transcribe.exceptions.BadRequestException:
            return {
                "statusCode": 404, 
                "body": json.dumps({"error": "Transcription job not found"}),
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
