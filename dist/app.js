"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _feature_repo = _interopRequireDefault(require("./feature/feature_repo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const featureController = {
  post: _feature_repo.default.create,
  put: _feature_repo.default.update,
  delete: _feature_repo.default.delete
};
const featuresController = {
  get: _feature_repo.default.findAll
};
const defaultController = {
  get(_, res) {
    res.end('Welcome to Feature toggle service');
  }

};
const routeToController = {
  feature: featureController,
  features: featuresController,
  default: defaultController
};

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

const responseError = (res, message, statusCode) => {
  res.statusCode = statusCode;
  res.end(message);
};

const featureFlagWebApp = async (req, res) => {
  let statusCode;

  try {
    let routeName = 'default';
    const uriSegmentMatch = req.url.match(/\/([^\/]+)\/?/);

    if (uriSegmentMatch !== null) {
      routeName = uriSegmentMatch[1];
    }

    if (!(routeName in routeToController)) {
      statusCode = 404;
      throw new Error(`Can not handle URL ${req.url}`);
    }

    const controller = routeToController[routeName];

    if (!(req.method.toLowerCase() in controller)) {
      statusCode = 404;
      throw new Error('Can not handle request as the handler for method does not exist');
    }

    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      try {
        req.body = await parseReqBody(req);
      } catch (err) {
        statusCode = 422;
        throw err;
      }
    }

    console.log(`Handling request: ${req.method} ${req.url} ${req.body ? JSON.stringify(req.body) : ''}`);

    try {
      const handler = controller[req.method.toLowerCase()];
      const result = await handler(req.body);
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = req.method === 'POST' ? 201 : 200;
      res.end(JSON.stringify(result));
    } catch (err) {
      statusCode = err.status;
      throw err;
    }
  } catch (err) {
    statusCode = statusCode || 500;
    responseError(res, err.message, statusCode);
  }
};

var _default = featureFlagWebApp;
exports.default = _default;