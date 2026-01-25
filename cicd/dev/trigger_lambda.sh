#!/bin/bash
set -e

echo "✅ CodeDeploy deployment complete. Triggering Lambda..."

# Set Lambda function name and payload if needed
REPO=mycomms-cms
LAMBDA_FUNCTION_NAME="executeTestSigma"
PAYLOAD="{ \"repo\": \"$REPO\" }"  # If your Lambda expects a payload

# Trigger Lambda function asynchronously (Event invocation)
aws lambda invoke --function-name "$LAMBDA_FUNCTION_NAME" \
                  --invocation-type Event \
                  --payload "$PAYLOAD" \
                  --region ap-southeast-2 \
                  response.json

# Check if the Lambda invocation was successful
if [ $? -eq 0 ]; then
  echo "🚀 Lambda function triggered successfully (asynchronous)-$REPO."
else
  echo "Sorry !! Failed to trigger Lambda function."
  exit 1
fi



