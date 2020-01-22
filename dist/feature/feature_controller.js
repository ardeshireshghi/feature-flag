"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _feature_service = _interopRequireDefault(require("./feature_service"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  feature
} = _config.default;
const featureService = new _feature_service.default({
  bucketName: feature.s3Bucket
});

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

const handlers = {
  async createFeature(req, res) {
    let jsonBody;

    try {
      jsonBody = await parseReqBody(req);
    } catch (err) {
      if (err) {
        await responseError(res, err.message, 422);
        return;
      }
    }

    const features = await featureService.fetch();

    if (jsonBody.name in features) {
      responseError(res, `Cannot create Feature name \'${jsonBody.name}\'. Feature name already exists`, 409);
      return;
    }

    featureService.save(jsonBody);
    res.statusCode = 201;
    res.end(JSON.stringify({
      name: jsonBody.name,
      enabled: jsonBody.enabled
    }));
  },

  async updateFeature(req, res) {
    let jsonBody;

    try {
      jsonBody = await parseReqBody(req);
    } catch (err) {
      if (err) {
        responseError(res, err.message, 422);
        return;
      }
    }

    const features = await featureService.fetch();

    if (!(jsonBody.name in features)) {
      responseError(res, `Cannot update non-existing Feature name \'${jsonBody.name}\'.`, 422);
      return;
    }

    featureService.save(jsonBody);
    res.end(JSON.stringify({
      name: jsonBody.name,
      enabled: jsonBody.enabled
    }));
  },

  async deleteFeature(req, res) {
    let jsonBody;

    try {
      jsonBody = await parseReqBody(req);
    } catch (err) {
      if (err) {
        responseError(res, err.message, 422);
        return;
      }
    }

    const features = await featureService.fetch();

    if (!(jsonBody.name in features)) {
      responseError(res, `Cannot delete non-existing Feature name \'${jsonBody.name}\'.`, 422);
      return;
    }

    featureService.delete({
      name: jsonBody.name
    });
    res.end();
  },

  async getFeatures(_, res) {
    res.end(JSON.stringify((await featureService.fetch())));
  }

};
var _default = {
  post: handlers.createFeature,
  put: handlers.updateFeature,
  get: handlers.getFeatures,
  delete: handlers.deleteFeature
};
exports.default = _default;