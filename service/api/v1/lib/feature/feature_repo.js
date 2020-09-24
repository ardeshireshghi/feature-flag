import FeatureService from './feature_service';
import config from '../config';

import Feature from './feature_model';

const { feature } = config;
const featureService = new FeatureService({ bucketName: feature.s3Bucket });

const repository = {
  async createFeature({ productName, name, enabled }) {
    if (!productName) {
      throw new Error('productName should be provided for features');
    }

    const features = await featureService.fetch({ productName });

    if (name in features) {
      const error = new Error(`Cannot create Feature name \'${name}\'. Feature name already exists`);
      error.status = 409;
      throw error;
    }

    const featureModel = new Feature(name, {
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

  async updateFeature({ productName, name, enabled }) {
    if (!productName) {
      throw new Error('productName should be provided for features');
    }
    const features = await featureService.fetch({ productName });

    if (!(name in features)) {
      const error = new Error(`Cannot update non-existing Feature name \'${name}\'.`);
      error.status = 422;
      throw error;
    }

    const featureModel = new Feature(name, features[name]);

    featureModel.setEnabled(enabled);
    featureModel.setUpdatedAt(new Date().toISOString());

    await featureService.save({
      productName,
      name,
      attributes: featureModel.valueOf()
    });

    return featureModel.valueOf();
  },

  async deleteFeature({ productName, name }) {
    if (!productName) {
      throw new Error('productName should be provided for features');
    }
    const features = await featureService.fetch({ productName });

    if (!(name in features)) {
      const error = new Error(`Cannot delete non-existing Feature name \'${name}\'.`);
      error.status = 422;
      throw error;
    }

    await featureService.delete({ productName, name });
    return true;
  },

  async getFeature({ name, productName } = {}) {
    if (!productName) {
      throw new Error('productName should be provided for features');
    }

    const features = await featureService.fetch({ productName });

    if (!name) {
      return features;
    }

    if (!(name in features)) {
      const error = new Error(`Cannot find non-existing Feature name \'${name}\'.`);
      error.status = 422;
      throw error;
    }

    return new Feature(name, features[name]).valueOf();
  }
};

export default {
  create: repository.createFeature,
  update: repository.updateFeature,
  find: repository.getFeature,
  delete: repository.deleteFeature
};
