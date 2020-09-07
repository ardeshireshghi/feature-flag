"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _product_repo = _interopRequireDefault(require("../product/product_repo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  get: _product_repo.default.find,
  post: _product_repo.default.create,
  delete: _product_repo.default.delete
};
exports.default = _default;