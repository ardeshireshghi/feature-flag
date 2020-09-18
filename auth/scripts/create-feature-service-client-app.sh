#!/usr/bin/env bash

set -eo pipefail

usage() {
  echo "Usage: $(basename "$0")"
  exit 1
}

user_pool_id="eu-west-1_TijnuyGsL"
app_client_id="4b8vhokqp1upoa5t4hlp9ourhk"

client_id="$(openssl rand -hex 8)"
password_hex="$(openssl rand -hex 16)"
client_secret="${password_hex:0:30}A@"

aws cognito-idp admin-create-user \
    --user-pool-id "$user_pool_id" \
    --username "$client_id" \
    --temporary-password "$client_secret" \
    --message-action SUPPRESS

challenge=$(aws cognito-idp admin-initiate-auth --user-pool-id $user_pool_id --client-id $app_client_id --auth-flow ADMIN_NO_SRP_AUTH --auth-parameters USERNAME=$client_id,PASSWORD=$client_secret)

challenge_session=$(echo $challenge | jq '.Session' | sed s/\"//g)
challenge_name=$(echo $challenge | jq '.ChallengeName' | sed s/\"//g)

aws cognito-idp admin-respond-to-auth-challenge \
  --user-pool-id "$user_pool_id" \
  --client-id "$app_client_id" \
  --challenge-name "$challenge_name" \
  --challenge-responses NEW_PASSWORD="$client_secret",USERNAME="$client_id" \
  --session=$challenge_session


echo "Feature flag new app client and secret created in Cognito\n"
echo "client id: $client_id"
echo "client secret: $client_secret"
