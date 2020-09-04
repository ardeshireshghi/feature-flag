"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routeToController = void 0;

var _feature_controller = _interopRequireDefault(require("./controllers/feature_controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultController = {
  get(_, res) {
    res.end('Hello! Feature toggle service');
  }

};
const routeToController = {
  feature: _feature_controller.default,
  features: _feature_controller.default,
  default: defaultController
};
exports.routeToController = routeToController;