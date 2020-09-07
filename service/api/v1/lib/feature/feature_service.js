import S3 from 'aws-sdk/clients/s3';
import config from '../config';
import cacheManager from 'ardi-cache';

const s3 = new S3();

const { feature } = config;

const FEATURE_S3_KEY = `feature-flag-service/product_name_md5_hash/features.json`;

const CACHE_KEY = 'features';
const CACHE_TTL_MINS = feature.cacheTTLMins;

const removeKey = (key, {[key]: _, ...rest}) => rest;

export default class FeatureService {
  constructor({ bucketName, cacheEnabled = true, cacheProvider = cacheManager() }) {
    this._bucketName = bucketName;
    this._cache = cacheProvider.store('object');
    this._cacheEnabled = cacheEnabled;
    this._featureS3KeyChecked = false;
  }

  async fetch({ useCache = true } = {}) {
    if (!this._featureS3KeyChecked) {
      await this._createS3KeyIfNotExists();
    }

    if (this._cacheEnabled) {
      const featuresCache = await this._cache.get(CACHE_KEY);

      if (useCache && featuresCache !== null) {
        return featuresCache;
      }
    }

    try {
      const featuresDataRaw = (await s3.getObject(this._createS3CallParams()).promise()).Body.toString('utf-8');
      const featuresData = JSON.parse(featuresDataRaw);

      this._cacheEnabled && await this._setCache(featuresData);
      return featuresData;
    } catch (err) {
      const errorMessage = `There was an error fetching features data from S3: ${err.message}`;
      console.error(errorMessage, err);

      throw new Error(errorMessage);
    }
  }

  async save({ name, attributes }) {
    let freshFeatureData = await this.fetch({ useCache: false });
    freshFeatureData = { ...freshFeatureData, [name]: attributes };

    await this._persist(freshFeatureData);
    this._cacheEnabled && await this._setCache(freshFeatureData);
  }

  async delete({ name }) {
    let freshFeatureData = await this.fetch({ useCache: false });
    const featuresToKeep = removeKey(name, freshFeatureData);

    await this._persist(featuresToKeep);
    this._cacheEnabled && await this._setCache(featuresToKeep);
  }

  async _persist(newFeatureBlob) {
    await s3
      .putObject({
        ...this._createS3CallParams(),
        Body: JSON.stringify(newFeatureBlob)
      })
      .promise();
  }

  _createS3CallParams() {
    return {
      Bucket: this._bucketName,
      Key: FEATURE_S3_KEY
    };
  }

  async _setCache(featuresData) {
    await this._cache.put(CACHE_KEY, featuresData, CACHE_TTL_MINS);
  }

  async _createS3KeyIfNotExists() {
    try {
      const res = await s3.headObject(this._createS3CallParams()).promise();
    } catch (err) {
      if (err && err.code === 'NotFound') {
        await this._persist({});
      }
    } finally {
      this._featureS3KeyChecked = true;
    }
  }
}
