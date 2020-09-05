"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _s = _interopRequireDefault(require("aws-sdk/clients/s3"));

var _config = _interopRequireDefault(require("../config"));

var _ardiCache = _interopRequireDefault(require("ardi-cache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const s3 = new _s.default();
const {
  feature
} = _config.default;
const FEATURE_S3_KEY = `feature-flag-service/user_name_md5_hash/product_name_md5_hash/features.json`;
const CACHE_KEY = 'features';
const CACHE_TTL_MINS = feature.cacheTTLMins;

class FeatureService {
  constructor({
    bucketName,
    cacheProvider = (0, _ardiCache.default)()
  }) {
    this._bucketName = bucketName;
    this._cache = cacheProvider.store('object');
    this._featureS3KeyChecked = false;
  }

  async fetch({
    useCache = true
  } = {}) {
    if (!this._featureS3KeyChecked) {
      await this._createS3KeyIfNotExists();
    }

    const featuresCache = await this._cache.get(CACHE_KEY);

    if (useCache && featuresCache !== null) {
      return featuresCache;
    }

    try {
      const featuresDataRaw = (await s3.getObject(this._createS3CallParams()).promise()).Body.toString('utf-8');
      const featuresData = JSON.parse(featuresDataRaw);
      await this._setCache(featuresData);
      return featuresData;
    } catch (err) {
      const errorMessage = `There was an error fetching features data from S3: ${err.message}`;
      console.error(errorMessage, err);
      throw new Error(errorMessage);
    }
  }

  async save({
    name,
    enabled
  }) {
    let freshFeatureData = await this.fetch({
      useCache: false
    });
    freshFeatureData = { ...freshFeatureData,
      [name]: enabled
    };
    await this._persist(freshFeatureData);
    await this._setCache(freshFeatureData);
  }

  async delete({
    name
  }) {
    let freshFeatureData = await this.fetch({
      useCache: false
    });
    const featureDataWithoutFeature = Object.keys(freshFeatureData).reduce((newFeaturesData, featureName) => {
      if (name !== featureName) {
        return { ...newFeaturesData,
          [featureName]: freshFeatureData[featureName]
        };
      }

      return newFeaturesData;
    }, {});
    await this._persist(featureDataWithoutFeature);
    await this._setCache(featureDataWithoutFeature);
  }

  async _persist(newFeatureBlob) {
    await s3.putObject({ ...this._createS3CallParams(),
      Body: JSON.stringify(newFeatureBlob)
    }).promise();
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

exports.default = FeatureService;