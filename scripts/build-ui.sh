#!/usr/bin/env bash

set -eox pipefail

source ./scripts/shared.sh

set +e
feature_flag_api_endpoint="$(service_endpoint)"
[[ -z "$feature_flag_api_endpoint" ]] && echo "cannot find feature service endpoint from serverless info, make sure the service is deployed" && exit 1
set -e

npm install

export REACT_APP_FEATURE_FLAG_SERVICE_BASE_URL="$feature_flag_api_endpoint"
export REACT_APP_COGNITO_CLIENT_ID="$cognito_client_id"

( cd ui && ./scripts/build.sh )
