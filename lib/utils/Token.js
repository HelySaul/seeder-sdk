'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _Env = require('./Env');

var _Env2 = _interopRequireDefault(_Env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Token = function () {
  function Token() {
    _classCallCheck(this, Token);
  }

  _createClass(Token, [{
    key: 'generate',
    value: function generate(user) {
      var preparedUser = Object.assign({}, user);
      delete preparedUser['config'];
      return _jsonwebtoken2.default.sign(preparedUser, _Env2.default.SECRET, {});
    }
  }, {
    key: 'httpValidate',
    value: function httpValidate(req, res, next) {
      var excluded = ['/module/system/authenticate/', '/module/system/ecommerce/new-user'];

      if (excluded.indexOf(req.url) > -1 || req.method === 'OPTIONS') return next();

      var token = req.headers['authorization'];
      if (token) {
        _jsonwebtoken2.default.verify(token, _Env2.default.SECRET, { ignoreExpiration: true }, function (err, decoded) {
          if (err) {
            res.status(401).send('invalid token');
          } else {
            req.user = decoded;
            next();
          }
        });
      } else {
        res.status(401).send('token not found');
      }
    }
  }, {
    key: 'socketValidate',
    value: function socketValidate(socket, next) {
      // const excluded = ['/module/system/authenticate/']
      // if (excluded.indexOf(req.url) > -1 || req.method === 'OPTIONS')
      //   return next()

      var socketHandshake = socket.handshake || {};
      var socketHandshakeQuery = socketHandshake.query || {};
      var socketUserToken = socketHandshakeQuery.token;

      if (socketUserToken) {
        _jsonwebtoken2.default.verify(socketUserToken, _Env2.default.SECRET, { ignoreExpiration: true }, function (err, decoded) {
          if (err) {
            socket.emit('ontokenstatus', 'error');
            next(err);
          } else {
            socket.emit('ontokenstatus', JSON.stringify(decoded));
            socket.user = decoded;
            socket.location = socketHandshakeQuery.location;
            next();
          }
        });
      } else {
        //new Error('not authorized')
        next();
      }
    }
  }]);

  return Token;
}();

exports.default = Token;