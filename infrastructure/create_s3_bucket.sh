#!/usr/bin/env bash

BUCKET_NAME="$1"
REGION="${2:-eu-west-1}"

aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION" --create-bucket-configuration LocationConstraint="$REGION"
