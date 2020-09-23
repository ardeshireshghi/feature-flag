"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addCORSHeaders = exports.responseError = void 0;

const responseError = (res, message, statusCode) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    error: message
  }));
};

exports.responseError = responseError;

const addCORSHeaders = res => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-client-type');
};

exports.addCORSHeaders = addCORSHeaders;