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
const PRODUCT_S3_KEY_PREFIX = 'feature-flag-service/products';

class ProductService {
  constructor({
    bucketName
  }) {
    this._bucketName = bucketName;
  }

  async fetch({
    name
  }) {
    try {
      const productDataRaw = (await s3.getObject(this._createS3ParamsByProductName(name)).promise()).Body.toString('utf-8');
      const parsedProductData = JSON.parse(productDataRaw);
      return parsedProductData;
    } catch (err) {
      console.error('Error getting product data from S3', err);
      const newError = new Error(`There was an error fetching product data: ${err.message}`);
      newError.code = err.code === 'NoSuchKey' ? 'NotFound' : 'GenericError';
      throw newError;
    }
  }

  async fetchAll() {
    const allProductS3Keys = await s3.listObjectsV2({
      Bucket: this._bucketName,
      Prefix: PRODUCT_S3_KEY_PREFIX
    }).promise();

    if (!allProductS3Keys.Contents.length) {
      return [];
    }

    const readProductObjectPromises = allProductS3Keys.Contents.filter(({
      Key
    }) => Key.includes('product.json')).map(({
      Key
    }) => s3.getObject({
      Bucket: 'feature-service-bucket',
      Key
    }).promise());
    const products = Promise.all(readProductObjectPromises).then(productsRaw => productsRaw.map(s3Response => JSON.parse(s3Response.Body.toString())));
    return products;
  }

  async update({
    name,
    attributes
  }) {
    let storedProductData = {};

    try {
      storedProductData = await this.fetch({
        name
      });
    } catch (err) {
      if (err.code !== 'NotFound') {
        throw err;
      }
    }

    const mergedProductData = { ...storedProductData,
      ...attributes
    };
    await this._persist(name, mergedProductData);
  }

  async create({
    name,
    attributes
  }) {
    await this._persist(name, attributes);
  }

  async delete({
    name
  }) {
    await this._delete(name);
  }

  async _persist(productName, newProductData) {
    await s3.putObject({ ...this._createS3ParamsByProductName(productName),
      Body: JSON.stringify(newProductData)
    }).promise();
  }

  async _delete(productName) {
    await s3.deleteObject({ ...this._createS3ParamsByProductName(productName)
    }).promise();
  }

  _createS3ParamsByProductName(productName) {
    return {
      Bucket: this._bucketName,
      Key: `${PRODUCT_S3_KEY_PREFIX}/${(0, _md.default)(productName)}/product.json`
    };
  }

}

exports.default = ProductService;