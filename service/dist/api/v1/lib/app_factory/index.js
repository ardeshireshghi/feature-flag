"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApp = createApp;

var _http = _interopRequireDefault(require("http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createApp() {
  const middlewares = [];

  const app = (req, res, next = () => {}) => {
    next();
  };

  return {
    use(middlewareFn) {
      middlewares.push(middlewareFn);
    },

    listen(...thisArgs) {
      const composedHandler = middlewares.reverse().reduce((composedHandler, middlewareFn) => {
        return (req, res) => {
          return middlewareFn(req, res, () => {
            composedHandler(req, res);
          });
        };
      }, app);

      const server = _http.default.createServer(composedHandler);

      return server.listen(...thisArgs);
    }

  };
}