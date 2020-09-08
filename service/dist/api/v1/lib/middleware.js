"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPreprocessingMiddleware = void 0;

const createPreprocessingMiddleware = (middlewareFn, nextFn) => {
  return (req, res) => {
    middlewareFn(req, res, () => {
      nextFn(req, res);
    });
  };
};

exports.createPreprocessingMiddleware = createPreprocessingMiddleware;