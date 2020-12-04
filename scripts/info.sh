#!/usr/bin/env bash

set -e

source ./scripts/shared.sh

stage="${1:-dev}"

serverless_info "$stage"
