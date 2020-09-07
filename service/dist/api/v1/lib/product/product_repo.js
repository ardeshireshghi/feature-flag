"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _product_service = _interopRequireDefault(require("./product_service"));

var _config = _interopRequireDefault(require("../config"));

var _product_model = _interopRequireDefault(require("./product_model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  feature
} = _config.default;
const productService = new _product_service.default({
  bucketName: feature.s3Bucket
});
const repository = {
  async createProduct({
    name,
    description
  }) {
    let productModel;

    try {
      const product = await productService.fetch({
        name
      });

      if (product) {
        const error = new Error(`Cannot create Product with name \'${name}\'. Product already exists`);
        error.status = 409;
        throw error;
      }
    } catch (err) {
      if (err.code === 'NotFound') {
        productModel = new _product_model.default(name, {
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

  async deleteProduct({
    name
  }) {
    productService.delete({
      name
    });
    return true;
  },

  async getProduct({
    name
  } = {}) {
    if (!name) {
      return await productService.fetchAll();
    }

    let product;

    try {
      product = await productService.fetch({
        name
      });
    } catch (err) {
      const error = new Error(`Cannot find non-existing Feature name \'${name}\'.`);
      error.status = 422;
      throw error;
    }

    return new _product_model.default(name, product).valueOf();
  }

};
var _default = {
  create: repository.createProduct,
  find: repository.getProduct,
  delete: repository.deleteProduct
};
exports.default = _default;