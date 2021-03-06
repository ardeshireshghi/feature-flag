"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _feature_service = _interopRequireDefault(require("./feature_service"));

var _config = _interopRequireDefault(require("../config"));

var _feature_model = _interopRequireDefault(require("./feature_model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  feature
} = _config.default;
const featureService = new _feature_service.default({
  bucketName: feature.s3Bucket
});
const repository = {
  async createFeature({
    productName,
    name,
    enabled
  }) {
    if (!productName) {
      throw new Error('productName should be provided for features');
    }

    const features = await featureService.fetch({
      productName
    });

    if (name in features) {
      const error = new Error(`Cannot create Feature name \'${name}\'. Feature name already exists`);
      error.status = 409;
      throw error;
    }

    const featureModel = new _feature_model.default(name, {
      enabled,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    await featureService.save({
      productName,
      name,
      attributes: featureModel.valueOf()
    });
    return featureModel.valueOf();
  },

  async updateFeature({
    productName,
    name,
    enabled
  }) {
    if (!productName) {
      throw new Error('productName should be provided for features');
    }

    const features = await featureService.fetch({
      productName
    });

    if (!(name in features)) {
      const error = new Error(`Cannot update non-existing Feature name \'${name}\'.`);
      error.status = 422;
      throw error;
    }

    const featureModel = new _feature_model.default(name, features[name]);
    featureModel.setEnabled(enabled);
    featureModel.setUpdatedAt(new Date().toISOString());
    await featureService.save({
      productName,
      name,
      attributes: featureModel.valueOf()
    });
    return featureModel.valueOf();
  },

  async deleteFeature({
    productName,
    name
  }) {
    if (!productName) {
      throw new Error('productName should be provided for features');
    }

    const features = await featureService.fetch({
      productName
    });

    if (!(name in features)) {
      const error = new Error(`Cannot delete non-existing Feature name \'${name}\'.`);
      error.status = 422;
      throw error;
    }

    await featureService.delete({
      productName,
      name
    });
    return true;
  },

  async getFeature({
    name,
    productName
  } = {}) {
    if (!productName) {
      throw new Error('productName should be provided for features');
    }

    const features = await featureService.fetch({
      productName
    });

    if (!name) {
      return features;
    }

    if (!(name in features)) {
      const error = new Error(`Cannot find non-existing Feature name \'${name}\'.`);
      error.status = 422;
      throw error;
    }

    return new _feature_model.default(name, features[name]).valueOf();
  }

};
var _default = {
  create: repository.createFeature,
  update: repository.updateFeature,
  find: repository.getFeature,
  delete: repository.deleteFeature
};
exports.default = _default;