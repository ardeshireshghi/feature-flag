"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseUrl = void 0;

const parseUrl = req => {
  const parsedUrl = new URL(`${req.connection.encrypted ? 'https' : 'http'}://${req.headers.host}${req.url}`);
  req.query = Object.fromEntries(new URLSearchParams(parsedUrl.search));
  req.host = req.host || parsedUrl.host;
  req.pathname = parsedUrl.pathname;
  req.protocol = parsedUrl.protocol;
};

exports.parseUrl = parseUrl;