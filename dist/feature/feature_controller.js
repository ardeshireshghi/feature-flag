"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _feature_service = _interopRequireDefault(require("./feature_service"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var feature = _config["default"].feature;
var featureService = new _feature_service["default"]({
  bucketName: feature.s3Bucket
});

var parseReqBody = function parseReqBody(req) {
  var data = [];
  return new Promise(function (resolve, reject) {
    req.on('data', function (chunk) {
      data.push(chunk);
    });
    req.on('end', function () {
      resolve(JSON.parse(Buffer.concat(data)));
    });
    req.on('error', function (err) {
      reject(err);
    });
  });
};

var responseError = function responseError(res, message, statusCode) {
  res.statusCode = statusCode;
  res.end(message);
};

var handlers = {
  createFeature: function () {
    var _createFeature = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(req, res) {
      var jsonBody, features;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return parseReqBody(req);

            case 3:
              jsonBody = _context.sent;
              _context.next = 12;
              break;

            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](0);

              if (!_context.t0) {
                _context.next = 12;
                break;
              }

              _context.next = 11;
              return responseError(res, _context.t0.message, 422);

            case 11:
              return _context.abrupt("return");

            case 12:
              _context.next = 14;
              return featureService.fetch();

            case 14:
              features = _context.sent;

              if (!(jsonBody.name in features)) {
                _context.next = 18;
                break;
              }

              responseError(res, "Cannot create Feature name '".concat(jsonBody.name, "'. Feature name already exists"), 409);
              return _context.abrupt("return");

            case 18:
              featureService.save(jsonBody);
              res.statusCode = 201;
              res.end(JSON.stringify({
                name: jsonBody.name,
                enabled: jsonBody.enabled
              }));

            case 21:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 6]]);
    }));

    function createFeature(_x, _x2) {
      return _createFeature.apply(this, arguments);
    }

    return createFeature;
  }(),
  updateFeature: function () {
    var _updateFeature = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(req, res) {
      var jsonBody, features;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return parseReqBody(req);

            case 3:
              jsonBody = _context2.sent;
              _context2.next = 11;
              break;

            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2["catch"](0);

              if (!_context2.t0) {
                _context2.next = 11;
                break;
              }

              responseError(res, _context2.t0.message, 422);
              return _context2.abrupt("return");

            case 11:
              _context2.next = 13;
              return featureService.fetch();

            case 13:
              features = _context2.sent;

              if (jsonBody.name in features) {
                _context2.next = 17;
                break;
              }

              responseError(res, "Cannot update non-existing Feature name '".concat(jsonBody.name, "'."), 422);
              return _context2.abrupt("return");

            case 17:
              featureService.save(jsonBody);
              res.end(JSON.stringify({
                name: jsonBody.name,
                enabled: jsonBody.enabled
              }));

            case 19:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 6]]);
    }));

    function updateFeature(_x3, _x4) {
      return _updateFeature.apply(this, arguments);
    }

    return updateFeature;
  }(),
  deleteFeature: function () {
    var _deleteFeature = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(req, res) {
      var jsonBody, features;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return parseReqBody(req);

            case 3:
              jsonBody = _context3.sent;
              _context3.next = 11;
              break;

            case 6:
              _context3.prev = 6;
              _context3.t0 = _context3["catch"](0);

              if (!_context3.t0) {
                _context3.next = 11;
                break;
              }

              responseError(res, _context3.t0.message, 422);
              return _context3.abrupt("return");

            case 11:
              _context3.next = 13;
              return featureService.fetch();

            case 13:
              features = _context3.sent;

              if (jsonBody.name in features) {
                _context3.next = 17;
                break;
              }

              responseError(res, "Cannot delete non-existing Feature name '".concat(jsonBody.name, "'."), 422);
              return _context3.abrupt("return");

            case 17:
              featureService["delete"]({
                name: jsonBody.name
              });
              res.end();

            case 19:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 6]]);
    }));

    function deleteFeature(_x5, _x6) {
      return _deleteFeature.apply(this, arguments);
    }

    return deleteFeature;
  }(),
  getFeatures: function () {
    var _getFeatures = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(_, res) {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.t0 = res;
              _context4.t1 = JSON;
              _context4.next = 4;
              return featureService.fetch();

            case 4:
              _context4.t2 = _context4.sent;
              _context4.t3 = _context4.t1.stringify.call(_context4.t1, _context4.t2);

              _context4.t0.end.call(_context4.t0, _context4.t3);

            case 7:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    function getFeatures(_x7, _x8) {
      return _getFeatures.apply(this, arguments);
    }

    return getFeatures;
  }()
};
var _default = {
  post: handlers.createFeature,
  put: handlers.updateFeature,
  get: handlers.getFeatures,
  "delete": handlers.deleteFeature
};
exports["default"] = _default;