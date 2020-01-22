#!/usr/bin/env node

const http  = require('http');
const dotEnv = require('dotenv');
const featuresFlagApp = require('../../dist/app').default;

dotEnv.config();

const { APP_PORT } = process.env;

http
  .createServer(featuresFlagApp)
  .listen(APP_PORT, () => {
    console.log(`Listening to port ${APP_PORT}`);
  });
