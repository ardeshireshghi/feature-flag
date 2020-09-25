#!/usr/bin/env bash

set -eo pipefail

source ./scripts/shared.sh

(
  cd ui/build
  aws s3 sync . "s3://$feature_ui_bucket_name" \
    --delete \
    --cache-control max-age=31536000,public

  aws s3 cp "s3://$feature_ui_bucket_name/index.html" "s3://$feature_ui_bucket_name/index.html" \
    --region "eu-west-1" \
    --metadata-directive REPLACE \
    --cache-control max-age=0,no-cache,no-store,must-revalidate \
    --content-type text/html \
    --acl public-read
)
