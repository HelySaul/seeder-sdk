'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _Token = require('./Token');

var _Token2 = _interopRequireDefault(_Token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebSocket = function () {
  function WebSocket(app) {
    _classCallCheck(this, WebSocket);

    this.webSocketClients = {};
    var token = new _Token2.default();

    this.httpServer = _http2.default.createServer(app);
    this.webSocketServer = (0, _socket2.default)(this.httpServer);
    this.webSocketServer.use(token.socketValidate);
  }

  _createClass(WebSocket, [{
    key: 'addClient',
    value: function addClient(groupName, userId, socketClient) {
      var groupWebSockets = this.webSocketClients[groupName] || {};
      var userWebSockets = groupWebSockets[userId] || [];
      userWebSockets.push(socketClient);
      groupWebSockets[userId] = userWebSockets;
      this.webSocketClients[groupName] = groupWebSockets;
    }
  }, {
    key: 'removeClient',
    value: function removeClient(groupName, userId, socketClient) {
      var groupWebSockets = this.webSocketClients[groupName] || {};
      var userWebSockets = groupWebSockets[userId] || [];
      this.webSocketClients[groupName][userId] = userWebSockets.filter(function (userWebSocket) {
        return userWebSocket !== socketClient;
      });
    }
  }, {
    key: 'emit',
    value: function emit(groupName, userId, eventName, object) {
      var groupWebSockets = this.webSocketClients[groupName] || {};
      var userWebSockets = groupWebSockets[userId] || [];

      userWebSockets.forEach(function (userWebSocket) {
        userWebSocket.emit(eventName, object);
      });
    }
  }, {
    key: 'broadcast',
    value: function broadcast(groupName, socketClientSource, eventName, object) {
      var groupWebSockets = this.webSocketClients[groupName] || {};
      var userIds = Object.keys(groupWebSockets);

      userIds.forEach(function (userId) {
        var userWebSockets = groupWebSockets[userId] || [];
        userWebSockets.forEach(function (userWebSocket) {
          if (userWebSocket !== socketClientSource) {
            userWebSocket.emit(eventName, object);
          }
        });
      });
    }
  }]);

  return WebSocket;
}();

exports.default = WebSocket;