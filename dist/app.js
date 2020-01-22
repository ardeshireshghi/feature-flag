"use strict";

var _http = _interopRequireDefault(require("http"));

var _feature_controller = _interopRequireDefault(require("./feature/feature_controller"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

const {
  APP_PORT
} = process.env;
const routes = {
  feature: _feature_controller.default,
  features: {
    get: _feature_controller.default.get
  },
  default: {
    get(_, res) {
      res.end('Welcome to Feature toggle service');
    }

  }
};

const requestHandler = async (req, res) => {
  try {
    let routeName = 'default';
    const uriSegmentMatch = req.url.match(/\/([^\/]+)\/?/);

    if (uriSegmentMatch !== null) {
      routeName = uriSegmentMatch[1];
    }

    if (!(routeName in routes)) {
      res.statusCode = 404;
      throw new Error(`Can not handle URL ${req.url}`);
    }

    const controller = routes[routeName];

    if (!(req.method.toLowerCase() in controller)) {
      res.statusCode = 404;
      throw new Error('Can not handle request as the handler for method does not exist');
    }

    res.setHeader('Content-Type', 'application/json');
    await controller[req.method.toLowerCase()](req, res);
  } catch (err) {
    res.end(err.message);
  }
};

_http.default.createServer(requestHandler).listen(APP_PORT, () => {
  console.log(`Listening to port ${APP_PORT}`);
});