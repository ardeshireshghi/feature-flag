#!/usr/bin/env bash

set -eo pipefail

usage() {
  echo "Usage: $(basename "$0") <stage-name>" && exit 1
}

[[ "$1" == "-h" || "$1" == *"help"* ]] && usage

# Node app build and serverless deployments
./scripts/build-backend.sh
./scripts/deploy-backend.sh

# React app build/deploy to S3
./scripts/build-ui.sh
./scripts/deploy-ui.sh
