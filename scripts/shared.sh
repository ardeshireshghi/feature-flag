#!/usr/bin/env bash

export stage="${1-dev}"
export feature_ui_bucket_name="$stage-feature-flag-service-ui"
export cognito_client_id="2n509urhek229vnc30a6ddvdup"
export user_pool_id="eu-west-1_bxc84ueLv"
export AWS_PAGER=""

if [[ "$stage" == "prod" ]]; then
  export feature_service_data_bucket_name="feature-service-bucket"
else
  export feature_service_data_bucket_name="$stage-feature-service-bucket"
fi

serverless_info() {
  set +e
  local info
  info=$(sls info --verbose --stage "$stage" --featureUIbucketName "$feature_ui_bucket_name")

  set +x
  if [[ "$?" -ne 0 ]]; then
    echo "$info" | grep -A4 "Serverless Error"
    exit 1
  fi
  set -ex

  echo "$info"
}

service_endpoint() {
  serverless_info | grep ServiceEndpoint | awk '{print $2}'
}

feature_ui_cloudfront_endpoint() {
  serverless_info | grep CloudfrontEndpoint | awk '{print $2}'
}
