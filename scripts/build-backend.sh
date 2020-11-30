#!/usr/bin/env bash

set -exo pipefail

pushd service > /dev/null
npm install
npm run build
popd > /dev/null

pushd auth > /dev/null
npm install
popd > /dev/null
