#!/usr/bin/env bash

feature_name="$1"
product_name="$2"

feature_api="http://localhost:8082/api/v1/feature?productName=$2"

curl -fv -H "Content-Type: application/json" -XPOST -d "{\"name\": \"$feature_name\", \"enabled\": false}" $feature_api
