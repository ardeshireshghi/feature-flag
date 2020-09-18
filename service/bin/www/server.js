#!/usr/bin/env node

const http  = require('http');
const dotEnv = require('dotenv');
const featuresFlagApiApp = require('../../dist/api/v1/lib/app').default;

dotEnv.config();

const { APP_PORT } = process.env;

featuresFlagApiApp
  .listen(APP_PORT, () => {
    console.log(`Listening to port ${APP_PORT}`);
  });
