"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

var _default = {
  envName: process.env.APP_ENV_NAME || 'development',
  feature: {
    cacheTTLMins: Number(process.env.FEATURE_CACHE_TTL_MINS) || 24 * 60,
    s3Bucket: process.env.FEATURE_S3_BUCKET
  },
  apiRoutePattern: /\/api\/v1\/([^\/]+)\/?/
};
exports.default = _default;