#!/usr/bin/env bash

feature_name="$1"
feature_api="http://localhost:8082/api/v1/feature"

curl -fv -XPOST -d "{\"name\": \"$feature_name\", \"enabled\": false}" $feature_api
