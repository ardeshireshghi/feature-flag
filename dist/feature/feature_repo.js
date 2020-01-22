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
const repository = {
  async createFeature({
    name,
    enabled
  }) {
    const features = await featureService.fetch();

    if (name in features) {
      const error = new Error(`Cannot create Feature name \'${name}\'. Feature name already exists`);
      error.status = 409;
      throw error;
    }

    featureService.save({
      name,
      enabled
    });
    return {
      name,
      enabled
    };
  },

  async updateFeature({
    name,
    enabled
  }) {
    const features = await featureService.fetch();

    if (!(name in features)) {
      const error = new Error(`Cannot update non-existing Feature name \'${name}\'.`);
      error.status = 422;
      throw error;
    }

    featureService.save({
      name,
      enabled
    });
    return {
      name,
      enabled
    };
  },

  async deleteFeature({
    name
  }) {
    const features = await featureService.fetch();

    if (!(name in features)) {
      const error = new Error(`Cannot delete non-existing Feature name \'${name}\'.`);
      error.status = 422;
      throw error;
    }

    featureService.delete({
      name
    });
    return true;
  },

  async getAllFeatures() {
    return await featureService.fetch();
  }

};
var _default = {
  create: repository.createFeature,
  update: repository.updateFeature,
  findAll: repository.getAllFeatures,
  delete: repository.deleteFeature
};
exports.default = _default;