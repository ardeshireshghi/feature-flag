"use strict";

var _http = _interopRequireDefault(require("http"));

var _feature_controller = _interopRequireDefault(require("./feature/feature_controller"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_dotenv["default"].config();

var APP_PORT = process.env.APP_PORT;
var routes = {
  feature: _feature_controller["default"],
  features: {
    get: _feature_controller["default"].get
  },
  "default": {
    get: function get(_, res) {
      res.end('Welcome to Feature toggle service');
    }
  }
};

var requestHandler =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var routeName, uriSegmentMatch, controller;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            routeName = 'default';
            uriSegmentMatch = req.url.match(/\/([^\/]+)\/?/);

            if (uriSegmentMatch !== null) {
              routeName = uriSegmentMatch[1];
            }

            if (routeName in routes) {
              _context.next = 7;
              break;
            }

            res.statusCode = 404;
            throw new Error("Can not handle URL ".concat(req.url));

          case 7:
            controller = routes[routeName];

            if (req.method.toLowerCase() in controller) {
              _context.next = 11;
              break;
            }

            res.statusCode = 404;
            throw new Error('Can not handle request as the handler for method does not exist');

          case 11:
            res.setHeader('Content-Type', 'application/json');
            _context.next = 14;
            return controller[req.method.toLowerCase()](req, res);

          case 14:
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](0);
            res.end(_context.t0.message);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 16]]);
  }));

  return function requestHandler(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

_http["default"].createServer(requestHandler).listen(APP_PORT, function () {
  console.log("Listening to port ".concat(APP_PORT));
});