#!/usr/bin/env bash

export stage="${1-dev}"
export feature_ui_bucket_name="$stage-feature-flag-service-ui"
export cognito_client_id="2n509urhek229vnc30a6ddvdup"
export user_pool_id="eu-west-1_bxc84ueLv"


if [[ "$stage" == "prod" ]]; then
  export feature_service_data_bucket_name="feature-service-bucket"
else
  export feature_service_data_bucket_name="$stage-feature-service-bucket"
fi

serverless_info() {
  sls info --verbose --stage "$stage" --featureUIbucketName "$feature_ui_bucket_name"
}

service_endpoint() {
  serverless_info | grep ServiceEndpoint | awk '{print $2}'
}

feature_ui_cloudfront_endpoint() {
  serverless_info | grep CloudfrontEndpoint | awk '{print $2}'
}
