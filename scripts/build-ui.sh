#!/usr/bin/env bash

set -eo pipefail

source ./scripts/shared.sh

feature_flag_api_endpoint="$(service_endpoint)"

[[ -z "$feature_flag_api_endpoint" ]] && echo "cannot find feature service endpoint from serverless info, make sure the service is deployed" && exit 1

export REACT_APP_FEATURE_FLAG_SERVICE_BASE_URL="$feature_flag_api_endpoint"
export REACT_APP_COGNITO_CLIENT_ID="$cognito_client_id"

( cd ui && ./scripts/build.sh )
