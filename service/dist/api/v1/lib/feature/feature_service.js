"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _s = _interopRequireDefault(require("aws-sdk/clients/s3"));

var _config = _interopRequireDefault(require("../config"));

var _ardiCache = _interopRequireDefault(require("ardi-cache"));

var _md = _interopRequireDefault(require("md5"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const s3 = new _s.default();
const {
  feature
} = _config.default;

const featureS3Key = productName => `feature-flag-service/products/${(0, _md.default)(productName)}/features.json`;

const CACHE_PREFIX = 'features';
const CACHE_TTL_MINS = feature.cacheTTLMins;

const removeKey = (key, {
  [key]: _,
  ...rest
}) => rest;

class FeatureService {
  constructor({
    bucketName,
    cacheEnabled = false,
    cacheProvider = (0, _ardiCache.default)()
  }) {
    this._bucketName = bucketName;
    this._cache = cacheProvider.store('object');
    this._cacheEnabled = cacheEnabled;
  }

  async fetch({
    useCache = true,
    productName
  } = {}) {
    if (this._cacheEnabled) {
      const featuresCache = await this._cache.get(`${CACHE_PREFIX}_${productName}`);

      if (useCache && featuresCache !== null) {
        return featuresCache;
      }
    }

    try {
      const featuresDataRaw = (await s3.getObject(this._createS3CallParams(productName)).promise()).Body.toString('utf-8');
      const featuresData = JSON.parse(featuresDataRaw);
      this._cacheEnabled && (await this._setCache(productName, featuresData));
      return featuresData;
    } catch (err) {
      const errorMessage = `Features for ${productName} cannot be found. productName can be invalid`;
      console.error(err);
      throw new Error(errorMessage);
    }
  }

  async save({
    name,
    productName,
    attributes
  }) {
    let freshFeatureData = await this.fetch({
      productName,
      useCache: false
    });
    freshFeatureData = { ...freshFeatureData,
      [name]: attributes
    };
    await this._persist(productName, freshFeatureData);
    this._cacheEnabled && (await this._setCache(productName, freshFeatureData));
  }

  async delete({
    productName,
    name
  }) {
    let freshFeatureData = await this.fetch({
      productName,
      useCache: false
    });
    const featuresToKeep = removeKey(name, freshFeatureData);
    await this._persist(productName, featuresToKeep);
    this._cacheEnabled && (await this._setCache(productName, featuresToKeep));
  }

  async _persist(productName, newFeatureBlob) {
    await s3.putObject({ ...this._createS3CallParams(productName),
      Body: JSON.stringify(newFeatureBlob)
    }).promise();
  }

  _createS3CallParams(featuresProductName) {
    return {
      Bucket: this._bucketName,
      Key: featureS3Key(featuresProductName)
    };
  }

  async _setCache(productName, featuresData) {
    await this._cache.put(`${CACHE_PREFIX}_${productName}`, featuresData, CACHE_TTL_MINS);
  }

}

exports.default = FeatureService;