#!/usr/bin/env node
"use strict";

const http = require('http');

const dotEnv = require('dotenv');

const featuresFlagApp = require('../../dist/app');

dotEnv.config();
const {
  APP_PORT
} = process.env;
http.createServer(featuresFlagApp).listen(APP_PORT, () => {
  console.log(`Listening to port ${APP_PORT}`);
});