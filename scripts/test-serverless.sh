#!/usr/bin/env bash

[[ -f ./auth/.env ]] && source auth/.env

if [[ -z "${TEST_API_CLIENT_ID}" ]]; then
  echo "Serverless invoke local requires test API user env variable \$TEST_API_CLIENT_ID"
  exit 1
fi

client_id="${TEST_API_CLIENT_ID}"
client_secret="${TEST_API_CLIENT_SECRET}"
lambda_event_path="$(mktemp -d)/test-event.json"
cat serverless/auth-event.json | sed -e "s/{{clientId}}/$client_id/" -e "s/{{clientSecret}}/$client_secret/" | tee "$lambda_event_path" > /dev/null

export SLS_WARNING_DISABLE=*

sls invoke local -f auth  \
  --appPoolId "$COGNITO_USER_POOL_ID" \
  --appPoolClientId "$COGNITO_APP_CLIENT_ID" \
  --path "$lambda_event_path"