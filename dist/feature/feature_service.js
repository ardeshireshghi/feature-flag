"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _s = _interopRequireDefault(require("aws-sdk/clients/s3"));

var _config = _interopRequireDefault(require("../config"));

var _ardiCache = _interopRequireDefault(require("ardi-cache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var s3 = new _s["default"]();
var feature = _config["default"].feature,
    envName = _config["default"].envName;
var FEATURE_S3_KEY = "feature-service/".concat(envName, "-features.json");
var CACHE_KEY = 'features';
var CACHE_TTL_MINS = feature.cacheTTLMins;

var FeatureService =
/*#__PURE__*/
function () {
  function FeatureService(_ref) {
    var bucketName = _ref.bucketName,
        _ref$cacheProvider = _ref.cacheProvider,
        cacheProvider = _ref$cacheProvider === void 0 ? (0, _ardiCache["default"])() : _ref$cacheProvider;

    _classCallCheck(this, FeatureService);

    this._bucketName = bucketName;
    this._cache = cacheProvider.store('object');
    this._featureS3KeyChecked = false;
  }

  _createClass(FeatureService, [{
    key: "fetch",
    value: function () {
      var _fetch = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var _ref2,
            _ref2$useCache,
            useCache,
            featuresCache,
            featuresDataRaw,
            featuresData,
            errorMessage,
            _args = arguments;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _ref2 = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, _ref2$useCache = _ref2.useCache, useCache = _ref2$useCache === void 0 ? true : _ref2$useCache;

                if (!this._featureS3KeyChecked) {
                  _context.next = 4;
                  break;
                }

                _context.next = 4;
                return this._createS3KeyIfNotExists();

              case 4:
                _context.next = 6;
                return this._cache.get(CACHE_KEY);

              case 6:
                featuresCache = _context.sent;

                if (!(useCache && featuresCache !== null)) {
                  _context.next = 9;
                  break;
                }

                return _context.abrupt("return", featuresCache);

              case 9:
                _context.prev = 9;
                _context.next = 12;
                return s3.getObject(this._createS3CallParams()).promise();

              case 12:
                featuresDataRaw = _context.sent.Body.toString('utf-8');
                featuresData = JSON.parse(featuresDataRaw);
                _context.next = 16;
                return this._setCache(featuresData);

              case 16:
                return _context.abrupt("return", featuresData);

              case 19:
                _context.prev = 19;
                _context.t0 = _context["catch"](9);
                errorMessage = 'There was an error fetching features data from S3';
                console.error(errorMessage, _context.t0);
                throw new Error(errorMessage);

              case 24:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[9, 19]]);
      }));

      function fetch() {
        return _fetch.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: "save",
    value: function () {
      var _save = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(_ref3) {
        var name, enabled, freshFeatureData;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                name = _ref3.name, enabled = _ref3.enabled;
                _context2.next = 3;
                return this.fetch({
                  useCache: false
                });

              case 3:
                freshFeatureData = _context2.sent;
                freshFeatureData = _objectSpread({}, freshFeatureData, _defineProperty({}, name, enabled));
                _context2.next = 7;
                return this._persist(freshFeatureData);

              case 7:
                _context2.next = 9;
                return this._setCache(freshFeatureData);

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function save(_x) {
        return _save.apply(this, arguments);
      }

      return save;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(_ref4) {
        var name, freshFeatureData, featureDataWithoutFeature;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                name = _ref4.name;
                _context3.next = 3;
                return this.fetch({
                  useCache: false
                });

              case 3:
                freshFeatureData = _context3.sent;
                featureDataWithoutFeature = Object.keys(freshFeatureData).reduce(function (newFeaturesData, featureName) {
                  if (name !== featureName) {
                    return _objectSpread({}, newFeaturesData, _defineProperty({}, featureName, freshFeatureData[featureName]));
                  }

                  return newFeaturesData;
                }, {});
                _context3.next = 7;
                return this._persist(featureDataWithoutFeature);

              case 7:
                _context3.next = 9;
                return this._setCache(featureDataWithoutFeature);

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function _delete(_x2) {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
  }, {
    key: "_persist",
    value: function () {
      var _persist2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(newFeatureBlob) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return s3.putObject(_objectSpread({}, this._createS3CallParams(), {
                  Body: JSON.stringify(newFeatureBlob)
                })).promise();

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function _persist(_x3) {
        return _persist2.apply(this, arguments);
      }

      return _persist;
    }()
  }, {
    key: "_createS3CallParams",
    value: function _createS3CallParams() {
      return {
        Bucket: this._bucketName,
        Key: FEATURE_S3_KEY
      };
    }
  }, {
    key: "_setCache",
    value: function () {
      var _setCache2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(featuresData) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this._cache.put(CACHE_KEY, featuresData, CACHE_TTL_MINS);

              case 2:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function _setCache(_x4) {
        return _setCache2.apply(this, arguments);
      }

      return _setCache;
    }()
  }, {
    key: "_createS3KeyIfNotExists",
    value: function () {
      var _createS3KeyIfNotExists2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return s3.headObject(this._createS3CallParams()).promise();

              case 3:
                _context6.next = 10;
                break;

              case 5:
                _context6.prev = 5;
                _context6.t0 = _context6["catch"](0);

                if (!(_context6.t0 && _context6.t0.code === 'NotFound')) {
                  _context6.next = 10;
                  break;
                }

                _context6.next = 10;
                return this._persist({});

              case 10:
                _context6.prev = 10;
                this._featureS3KeyChecked = true;
                return _context6.finish(10);

              case 13:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 5, 10, 13]]);
      }));

      function _createS3KeyIfNotExists() {
        return _createS3KeyIfNotExists2.apply(this, arguments);
      }

      return _createS3KeyIfNotExists;
    }()
  }]);

  return FeatureService;
}();

exports["default"] = FeatureService;