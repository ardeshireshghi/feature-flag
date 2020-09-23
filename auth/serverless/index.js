// Modules
const serverless = require('serverless-http');
const { getApp } = require('../src/app');

// Handler
module.exports.handler = serverless(getApp());
