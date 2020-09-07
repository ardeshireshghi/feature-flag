import S3 from 'aws-sdk/clients/s3';
import config from '../config';
import cacheManager from 'ardi-cache';
import md5 from 'md5';

const s3 = new S3();

const { feature } = config;

const PRODUCT_S3_KEY_PREFIX = `feature-flag-service/products`;

export default class ProductService {
  constructor({ bucketName }) {
    this._bucketName = bucketName;
  }

  async fetch({ name }) {
    try {
      const productDataRaw = (await s3.getObject(this._createS3CallParams(name)).promise()).Body.toString('utf-8');
      const parsedProductData = JSON.parse(productDataRaw);

      return parsedProductData;
    } catch (err) {
      console.error('Error getting product data from S3', err);

      const newError = new Error(`There was an error fetching product data: ${err.message}`);
      newError.code = err.code === 'NoSuchKey' ? 'NotFound' : 'GenericError';

      throw newError;
    }
  }

  async update({ name, attributes }) {
    let storedProductData = {};

    try {
      storedProductData = await this.fetch({ name });
    } catch (err) {
      if (err.code !== 'NotFound') {
        throw err;
      }
    }

    const mergedProductData = { ...storedProductData, ...attributes };
    await this._persist(name, mergedProductData);
  }

  async create({ name, attributes }) {
    await this._persist(name, attributes);
  }

  async delete({ name }) {
    await this._delete(name);
  }

  async _persist(productName, newProductData) {
    await s3
      .putObject({
        ...this._createS3CallParams(productName),
        Body: JSON.stringify(newProductData)
      })
      .promise();
  }

  async _delete(productName) {
    await s3
      .deleteObject({
        ...this._createS3CallParams(productName)
      })
      .promise();
  }

  _createS3CallParams(productName) {
    return {
      Bucket: this._bucketName,
      Key: `${PRODUCT_S3_KEY_PREFIX}/${md5(productName)}/product.json`
    };
  }
}
