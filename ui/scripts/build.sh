#!/usr/bin/env bash

node -v

export REACT_APP_FEATURE_FLAG_SERVICE_BASE_URL=http://localhost:8082
react-scripts build
