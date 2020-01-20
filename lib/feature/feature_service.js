import S3 from 'aws-sdk/clients/s3';
import config from '../config';
const s3 = new S3();

const { feature, envName } = config;

const FEATURE_S3_KEY = `feature-service/${envName}-features.json`;
const CACHE_TTL_MINS = feature.cacheTTLMins;

let featuresCache = {};

export default class FeatureService {
  constructor({ bucketName }) {
    this._bucketName = bucketName;
    this._createS3KeyIfNotExists();
  }

  async fetch({ useCache = true } = {}) {
    if (useCache && this._hasValidCache()) {
      return featuresCache.data;
    }

    try {
      const featuresDataRaw = (await (s3.getObject(this._createParams()).promise())).Body.toString('utf-8');
      const featuresData = JSON.parse(featuresDataRaw);

      if (useCache) {
        this._setCache(featuresData);
      }

      return featuresData;
    } catch(err) {
      const errorMessage = 'There was an error fetching features data from S3';
      console.error(errorMessage, err);

      throw new Error(errorMessage);
    }
  }

  async save({ name, enabled }) {
    let freshFeatureData = await this.fetch({ useCache: false });
    freshFeatureData = {...freshFeatureData, [name]: enabled };

    await this._persist(freshFeatureData);
    this._setCache(freshFeatureData);
  }

  async delete({ name }) {
    let freshFeatureData = await this.fetch({ useCache: false });

    const featureDataWithoutFeature = Object.keys(freshFeatureData).reduce((newFeaturesData, featureName) => {
      if (name !== featureName) {
        return {
          ...newFeaturesData,
          [featureName]: freshFeatureData[featureName]
        };
      }

      return newFeaturesData;
    }, {});

    await this._persist(featureDataWithoutFeature);
    this._setCache(featureDataWithoutFeature);
  }

  async _persist(newFeatureBlob) {
    await s3.putObject({
      ...this._createParams(),
      Body: JSON.stringify(newFeatureBlob)
    }).promise();
  }

  _createParams() {
    return {
      Bucket: this._bucketName,
      Key: FEATURE_S3_KEY
    };
  }

  _hasValidCache() {
    return featuresCache.data && featuresCache.data.expiry >= Date.now();
  }

  _setCache(featuresData) {
    featuresCache = {
      data: featuresData,
      expiry: Date.now() + CACHE_TTL_MINS * 60 * 1000
    };
  }

  _createS3KeyIfNotExists() {
    s3.headObject(this._createParams(), (err, metadata) => {
      if (err && err.code === 'NotFound') {
        this._persist({});
      }
    });
  }
}
