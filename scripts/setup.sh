#!/usr/bin/env bash

npm install -g serverless
npm i

(cd auth && npm i && cp .env{.example,})
(cd service && npm i && cp .env{.example,})
(cd ui && npm i)
