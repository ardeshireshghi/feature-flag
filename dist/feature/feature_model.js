"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Feature =
/*#__PURE__*/
function () {
  function Feature(_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;

    _classCallCheck(this, Feature);

    this._name = name;
    this._enabled = enabled;
  }

  _createClass(Feature, [{
    key: "name",
    value: function name() {
      return this._name;
    }
  }, {
    key: "isEnabled",
    value: function isEnabled() {
      return this._enabled;
    }
  }, {
    key: "disable",
    value: function disable() {
      this._enabled = false;
    }
  }]);

  return Feature;
}();