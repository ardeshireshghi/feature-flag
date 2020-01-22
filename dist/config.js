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
    cacheTTLMins: 24 * 60,
    s3Bucket: process.env.FEATURE_S3_BUCKET
  }
};
exports.default = _default;