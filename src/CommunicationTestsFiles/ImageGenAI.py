import json
import boto3
import base64
import uuid
import os
from datetime import datetime
from botocore.exceptions import ClientError
import random

def lambda_handler(event, context):
    """
    Lambda function to generate images using Amazon Bedrock Titan Image Generator,
    store them in S3, and return the image URL via API Gateway.
    Also supports retrieving existing images by sessionId.
    """
    
    # Initialize AWS clients
    try:
        bedrock_client = boto3.client('bedrock-runtime', region_name='us-east-1')
        s3_client = boto3.client('s3', region_name='ap-south-1')
    except Exception as e:
        return create_error_response(500, f"Failed to initialize AWS clients: {str(e)}")
    
    # S3 bucket configuration (based on your IAM permissions)
    S3_BUCKET_NAME = 'museumwebsite'
    
    try:
        # Parse the request body
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event.get('body', {})
        
        # Check if this is a request to retrieve existing images
        action = body.get('action', 'generate')  # 'generate' or 'retrieve'
        session_id = body.get('sessionId')
        
        if not session_id:
            return create_error_response(400, "Missing required parameter: sessionId")
        
        # Handle retrieve action
        if action == 'retrieve':
            return retrieve_images_by_session(s3_client, S3_BUCKET_NAME, session_id)
        
        # Handle generate action (default)
        prompt = body.get('prompt')
        if not prompt:
            return create_error_response(400, "Missing required parameter: prompt")
        
        # Optional parameters with defaults for Titan Image Generator
        negative_prompts = body.get('negative_prompts', [])
        quality = body.get('quality', 'standard')  # standard or premium
        cfg_scale = body.get('cfg_scale', 8.0)
        seed = body.get('seed', random.randint(0, 2147483647))
        width = body.get('width', 1024)
        height = body.get('height', 1024)
        number_of_images = body.get('number_of_images', 1)
        
        # Validate parameters
        if quality not in ['standard', 'premium']:
            return create_error_response(400, "Quality must be 'standard' or 'premium'")
        
        if width not in [512, 768, 1024] or height not in [512, 768, 1024]:
            return create_error_response(400, "Width and height must be 512, 768, or 1024")
        
        if number_of_images < 1 or number_of_images > 5:
            return create_error_response(400, "Number of images must be between 1 and 5")
        
        print(f"Generating {number_of_images} image(s) with prompt: {prompt} for sessionId: {session_id}")
        
        # Generate image using Titan Image Generator on Bedrock
        image_data_list = generate_image_with_titan(
            bedrock_client, prompt, negative_prompts, quality, 
            cfg_scale, seed, width, height, number_of_images
        )
        
        # Upload images to S3 and get URLs using sessionId
        image_urls = []
        for i, image_data in enumerate(image_data_list):
            image_url = upload_to_s3_and_get_url(
                s3_client, image_data, S3_BUCKET_NAME, session_id, prompt, i
            )
            image_urls.append(image_url)
        
        # Return success response
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({
                'success': True,
                'message': f'Successfully generated {len(image_urls)} image(s)',
                'image_urls': image_urls,
                'prompt': prompt,
                'quality': quality,
                'dimensions': f"{width}x{height}",
                'seed': seed,
                'sessionId': session_id
            })
        }
        
    except Exception as e:
        print(f"Error in lambda_handler: {str(e)}")
        return create_error_response(500, str(e))

def generate_image_with_titan(bedrock_client, prompt, negative_prompts, quality, cfg_scale, seed, width, height, number_of_images):
    """
    Generate image using Amazon Titan Image Generator model on Amazon Bedrock
    """
    try:
        # Set the model ID for Titan Image Generator
        model_id = "amazon.titan-image-generator-v1"
        
        # Format the request payload for Titan Image Generator
        request_body = {
            "taskType": "TEXT_IMAGE",
            "textToImageParams": {
                "text": prompt,
                "negativeText": " ".join(negative_prompts) if negative_prompts else ""
            },
            "imageGenerationConfig": {
                "numberOfImages": number_of_images,
                "quality": quality,
                "cfgScale": cfg_scale,
                "height": height,
                "width": width,
                "seed": seed
            }
        }
        
        print(f"Titan request: {json.dumps(request_body, indent=2)}")
        
        # Convert the request to JSON
        request_json = json.dumps(request_body)
        
        # Invoke the model
        response = bedrock_client.invoke_model(
            modelId=model_id,
            body=request_json,
            contentType='application/json',
            accept='application/json'
        )
        
        # Parse the response
        response_body = json.loads(response["body"].read())
        
        # Extract image data
        if "images" not in response_body:
            raise Exception("No images returned from Titan Image Generator")
        
        image_data_list = []
        for image in response_body["images"]:
            base64_image_data = image
            image_data = base64.b64decode(base64_image_data)
            image_data_list.append(image_data)
        
        print(f"Successfully generated {len(image_data_list)} image(s)")
        
        return image_data_list
        
    except ClientError as e:
        error_code = e.response['Error']['Code']
        error_message = e.response['Error']['Message']
        raise Exception(f"Bedrock ClientError [{error_code}]: {error_message}")
    except Exception as e:
        raise Exception(f"Error generating image with Titan: {str(e)}")

def upload_to_s3_and_get_url(s3_client, image_data, bucket_name, session_id, prompt, image_index):
    """
    Upload image to S3 and return a presigned URL using sessionId for consistent naming
    """
    try:
        # Generate filename using sessionId for consistent access
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")        
        # Use sessionId as the primary identifier
        object_key = f"generated-images/{session_id}_{timestamp}_{image_index}.png"
        
        print(f"Uploading to S3: {bucket_name}/{object_key}")
        
        # Upload image to S3
        s3_client.put_object(
            Bucket=bucket_name,
            Key=object_key,
            Body=image_data,
            ContentType='image/png',
            Metadata={
                'generated-by': 'titan-image-generator-lambda',
                'timestamp': timestamp,
                'prompt': prompt[:100],  # Truncate long prompts
                'image-index': str(image_index),
                'session-id': session_id
            }
        )
        
        # Generate presigned URL (valid for 24 hours)
        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': object_key},
            ExpiresIn=86400  # 24 hours
        )
        
        print(f"Successfully uploaded image {image_index} and generated presigned URL")
        
        return presigned_url
        
    except ClientError as e:
        error_code = e.response['Error']['Code']
        error_message = e.response['Error']['Message']
        raise Exception(f"S3 ClientError [{error_code}]: {error_message}")
    except Exception as e:
        raise Exception(f"Error uploading to S3: {str(e)}")

def retrieve_images_by_session(s3_client, bucket_name, session_id):
    """
    Retrieve existing images for a given sessionId
    """
    try:
        print(f"Retrieving images for sessionId: {session_id}")
        
        # List objects with sessionId prefix
        response = s3_client.list_objects_v2(
            Bucket=bucket_name,
            Prefix=f"generated-images/{session_id}_"
        )
        
        if 'Contents' not in response:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': f'No images found for sessionId: {session_id}'
                })
            }
        
        # Generate presigned URLs for found images
        image_urls = []
        for obj in response['Contents']:
            presigned_url = s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': bucket_name, 'Key': obj['Key']},
                ExpiresIn=86400  # 24 hours
            )
            image_urls.append({
                'url': presigned_url,
                'key': obj['Key'],
                'last_modified': obj['LastModified'].isoformat(),
                'size': obj['Size']
            })
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': f'Found {len(image_urls)} image(s) for sessionId: {session_id}',
                'sessionId': session_id,
                'images': image_urls,
                'image_urls': [img['url'] for img in image_urls]  # For backward compatibility
            })
        }
        
    except Exception as e:
        print(f"Error retrieving images: {str(e)}")
        return create_error_response(500, f"Error retrieving images: {str(e)}")

def create_error_response(status_code, error_message):
    """
    Create standardized error response
    """
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': False,
            'error': error_message
        })
    }
