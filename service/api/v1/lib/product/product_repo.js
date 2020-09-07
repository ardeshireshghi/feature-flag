import ProductService from './product_service';
import config from '../config';

import Product from './product_model';

const { feature } = config;
const productService = new ProductService({ bucketName: feature.s3Bucket });

const repository = {
  async createProduct({ name, description }) {
    let productModel;

    try {
      const product = await productService.fetch({ name });
      if (product) {
        const error = new Error(`Cannot create Product with name \'${name}\'. Product already exists`);
        error.status = 409;
        throw error;
      }
    } catch (err) {
      if (err.code === 'NotFound') {
        productModel = new Product(name, {
          createdByUserId: 1,
          description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        productService.create({
          name,
          attributes: productModel.valueOf()
        });

        return productModel.valueOf();
      } else {
        throw err;
      }
    }
  },

  async deleteProduct({ name }) {
    productService.delete({ name });
    return true;
  },

  async getProduct({ name } = {}) {
    if (!name) {
      return await productService.fetchAll();
    }

    let product;

    try {
      product = await productService.fetch({ name });
    } catch (err) {
      const error = new Error(`Cannot find non-existing Feature name \'${name}\'.`);
      error.status = 422;
      throw error;
    }

    return new Product(name, product).valueOf();
  }
};

export default {
  create: repository.createProduct,
  find: repository.getProduct,
  delete: repository.deleteProduct
};
