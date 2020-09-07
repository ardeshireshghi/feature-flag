"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routeToController = void 0;

var _feature_controller = _interopRequireDefault(require("./controllers/feature_controller"));

var _product_controller = _interopRequireDefault(require("./controllers/product_controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultHandler = (_, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    hello: 'Feature toggle service'
  }));
};

const defaultController = {
  get: defaultHandler
};
const routeToController = {
  feature: _feature_controller.default,
  features: _feature_controller.default,
  product: _product_controller.default,
  products: _product_controller.default,
  default: defaultController
};
exports.routeToController = routeToController;