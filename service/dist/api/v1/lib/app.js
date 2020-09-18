"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _url = _interopRequireDefault(require("url"));

var _config = _interopRequireDefault(require("./config"));

var _app_factory = require("./app_factory");

var _routes = require("./routes");

var _request_bodyparser = require("./parsers/request_bodyparser");

var _url_parser = require("./parsers/url_parser");

var _response = require("./http/response");

var _auth = require("./auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _app_factory.createApp)();
const {
  apiRoutePattern
} = _config.default;

const shouldParseRequestBody = reqMethod => ['POST', 'PUT', 'DELETE'].includes(reqMethod);

const featureFlagWebAppHandler = async (req, res) => {
  let statusCode;

  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }

  try {
    let routeName = 'default';
    const uriSegmentMatch = req.pathname.match(apiRoutePattern);

    if (uriSegmentMatch !== null) {
      routeName = uriSegmentMatch[1];
    }

    if (!(routeName in _routes.routeToController)) {
      statusCode = 404;
      throw new Error(`Can not handle URL ${req.url}`);
    }

    const controller = _routes.routeToController[routeName];

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
  (0, _url_parser.parseUrl)(req);
  (0, _response.addCORSHeaders)(res);
  next();
}); // app.use(authoriser);

app.use(featureFlagWebAppHandler);
var _default = app;
exports.default = _default;