"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _feature_repo = _interopRequireDefault(require("../feature/feature_repo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  get: _feature_repo.default.find,
  post: _feature_repo.default.create,
  put: _feature_repo.default.update,
  delete: _feature_repo.default.delete
};
exports.default = _default;