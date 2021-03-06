"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _url = _interopRequireDefault(require("url"));

var _app_factory = require("./app_factory");

var _routes = require("./routes");

var _request_bodyparser = require("./parsers/request_bodyparser");

var _url_parser = require("./parsers/url_parser");

var _response = require("./http/response");

var _auth = require("./auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _app_factory.createApp)();

const shouldParseRequestBody = reqMethod => ['POST', 'PUT', 'DELETE'].includes(reqMethod);

const featureFlagWebAppHandler = async (req, res) => {
  let statusCode;
  let controller;

  try {
    try {
      controller = (0, _routes.resolveRouteController)(req.pathname);
    } catch (err) {
      console.error('Error resolving the route:', err);
      statusCode = 404;
      throw new Error(`Can not handle URL ${req.url}`);
    }

    if (!(req.method.toLowerCase() in controller)) {
      statusCode = 405;
      throw new Error('Can not handle request as the handler for method does not exist');
    }

    if (shouldParseRequestBody(req.method)) {
      try {
        req.body = await (0, _request_bodyparser.parseReqBody)(req);
      } catch (err) {
        statusCode = 422;
        throw err;
      }
    }

    console.log(`Handling request: ${req.method} ${req.url} ${req.body ? JSON.stringify(req.body) : ''}`);

    try {
      const handler = controller[req.method.toLowerCase()];
      const result = await handler(req.method === 'GET' ? req.query : { ...req.query,
        ...req.body
      });
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = req.method === 'POST' ? 201 : 200;
      res.end(JSON.stringify(result));
    } catch (err) {
      statusCode = err.status;
      throw err;
    }
  } catch (err) {
    statusCode = statusCode || 500;
    (0, _response.responseError)(res, err.message, statusCode);
  }
};

app.use((req, res, next) => {
  (0, _response.addCORSHeaders)(res);

  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }

  (0, _url_parser.parseUrl)(req);
  next();
});
app.use(_auth.authoriser);
app.use(featureFlagWebAppHandler);
var _default = app;
exports.default = _default;