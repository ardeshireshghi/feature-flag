import S3 from 'aws-sdk/clients/s3';
import config from '../config';
import cacheManager from 'ardi-cache';
import md5 from 'md5';

const s3 = new S3();

const { feature } = config;

const featureS3Key = productName => `feature-flag-service/products/${md5(productName)}/features.json`;

const CACHE_PREFIX = 'features';
const CACHE_TTL_MINS = feature.cacheTTLMins;

const removeKey = (key, { [key]: _, ...rest }) => rest;

export default class FeatureService {
  constructor({ bucketName, cacheEnabled = false, cacheProvider = cacheManager() }) {
    this._bucketName = bucketName;
    this._cache = cacheProvider.store('object');
    this._cacheEnabled = cacheEnabled;
  }

  async fetch({ useCache = true, productName } = {}) {
    if (this._cacheEnabled) {
      const featuresCache = await this._cache.get(`${CACHE_PREFIX}_${productName}`);

      if (useCache && featuresCache !== null) {
        return featuresCache;
      }
    }

    try {
      const featuresDataRaw = (await s3.getObject(this._createS3CallParams(productName)).promise()).Body.toString(
        'utf-8'
      );
      const featuresData = JSON.parse(featuresDataRaw);

      this._cacheEnabled && (await this._setCache(productName, featuresData));
      return featuresData;
    } catch (err) {
      const errorMessage = `Features for ${productName} cannot be found. productName can be invalid`;
      console.error(err);

      throw new Error(errorMessage);
    }
  }

  async save({ name, productName, attributes }) {
    let freshFeatureData = await this.fetch({ productName, useCache: false });
    freshFeatureData = { ...freshFeatureData, [name]: attributes };

    await this._persist(productName, freshFeatureData);
    this._cacheEnabled && (await this._setCache(productName, freshFeatureData));
  }

  async delete({ productName, name }) {
    let freshFeatureData = await this.fetch({ productName, useCache: false });
    const featuresToKeep = removeKey(name, freshFeatureData);

    await this._persist(productName, featuresToKeep);
    this._cacheEnabled && (await this._setCache(productName, featuresToKeep));
  }

  async _persist(productName, newFeatureBlob) {
    await s3
      .putObject({
        ...this._createS3CallParams(productName),
        Body: JSON.stringify(newFeatureBlob)
      })
      .promise();
  }

  _createS3CallParams(featuresProductName) {
    console.log('KEY FOR FEATURES', featuresProductName, featureS3Key(featuresProductName));
    return {
      Bucket: this._bucketName,
      Key: featureS3Key(featuresProductName)
    };
  }

  async _setCache(productName, featuresData) {
    await this._cache.put(`${CACHE_PREFIX}_${productName}`, featuresData, CACHE_TTL_MINS);
  }
}
