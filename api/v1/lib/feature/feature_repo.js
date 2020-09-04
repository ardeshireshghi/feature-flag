import FeatureService from './feature_service';
import config from '../config';

const { feature } = config;
const featureService = new FeatureService({ bucketName: feature.s3Bucket });

const repository = {
  async createFeature({ name, enabled }) {
    const features = await featureService.fetch();

    if (name in features) {
      const error = new Error(`Cannot create Feature name \'${name}\'. Feature name already exists`);
      error.status = 409;
      throw error;
    }

    featureService.save({ name, enabled });

    return {
      name,
      enabled
    };
  },

  async updateFeature({ name, enabled }) {
    const features = await featureService.fetch();

    if (!(name in features)) {
      const error = new Error(`Cannot update non-existing Feature name \'${name}\'.`);
      error.status = 422;
      throw error;
    }

    featureService.save({ name, enabled });

    return {
      name,
      enabled
    };
  },

  async deleteFeature({ name }) {
    const features = await featureService.fetch();

    if (!(name in features)) {
      const error = new Error(`Cannot delete non-existing Feature name \'${name}\'.`);
      error.status = 422;
      throw error;
    }

    featureService.delete({ name });
    return true;
  },

  async getFeature({ name } = {}) {
    const features = await featureService.fetch();

    if (!name) {
      return features;
    }

    if (!(name in features)) {
      const error = new Error(`Cannot find non-existing Feature name \'${name}\'.`);
      error.status = 422;
      throw error;
    }

    return {
      name,
      enabled: features[name]
    };
  }
};

export default {
  create: repository.createFeature,
  update: repository.updateFeature,
  find: repository.getFeature,
  delete: repository.deleteFeature
};
