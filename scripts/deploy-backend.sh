#!/usr/bin/env bash

set -exo pipefail

source ./scripts/shared.sh

feature_ui_endpoint="$(feature_ui_cloudfront_endpoint)"

sls deploy --force \
  --stage "$stage" \
  --featureUIbucketName "$feature_ui_bucket_name" \
  --featureDatabucketName "$feature_service_data_bucket_name" \
  --aws-s3-accelerate

# Update user pool valid callback urls based on S3 website URL
aws cognito-idp update-user-pool-client \
  --user-pool-id "$user_pool_id" \
  --client-id "$cognito_client_id" \
  --callback-urls "[\"http://localhost:5000/login-callback\",\"http://localhost:3000/login-callback\",\"https://$feature_ui_endpoint/login-callback\"]" \
  --allowed-o-auth-scopes '["https://feature-flag-service.sh/features.read"]' \
  --supported-identity-providers '["COGNITO"]' \
  --allowed-o-auth-flows '["implicit"]' \
  --allowed-o-auth-flows-user-pool-client
