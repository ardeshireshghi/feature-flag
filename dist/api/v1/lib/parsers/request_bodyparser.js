"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseReqBody = void 0;

const parseReqBody = req => {
  const data = [];
  return new Promise((resolve, reject) => {
    req.on('data', chunk => {
      data.push(chunk);
    });
    req.on('end', () => {
      resolve(JSON.parse(Buffer.concat(data)));
    });
    req.on('error', err => {
      reject(err);
    });
  });
};

exports.parseReqBody = parseReqBody;