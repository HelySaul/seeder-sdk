'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _ApiError = require('./ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Handler = function () {
  function Handler() {
    _classCallCheck(this, Handler);
  }

  _createClass(Handler, [{
    key: 'error',
    value: async function error(_error, req) {
      _logger2.default.error(new Date() + ' - ' + req.method + ' - ' + req.url + ' - ' + _error.message);
      return _error;
    }
  }, {
    key: 'checkOwner',
    value: async function checkOwner(req, object) {
      if (req.user._id === object.owner) return object;
      throw new _ApiError2.default('QueryError', 'Object Not Found', 403);
    }
  }]);

  return Handler;
}();

exports.default = Handler;