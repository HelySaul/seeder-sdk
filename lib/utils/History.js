'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var History = function () {
  function History() {
    _classCallCheck(this, History);
  }

  _createClass(History, [{
    key: 'add',
    value: function add(dbConnection, dbName, owner, regarding, webSocket, webSocketGroupName) {
      var historyObj = {
        type: 'profile-history',
        owner: owner,
        dateTime: (0, _moment2.default)().utc(),
        regarding: regarding
      };
      dbConnection.insert(dbName, historyObj).then(function (data) {
        webSocket.emit(webSocketGroupName, owner, '/' + webSocketGroupName + '/history', historyObj);
      }).catch(function (error) {
        return _logger2.default.error('Error adding history: ' + error);
      });
    }
  }]);

  return History;
}();

exports.default = History;