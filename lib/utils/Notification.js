'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Notification = function () {
  function Notification(login, pass) {
    _classCallCheck(this, Notification);

    // this.mailLogin = login 
    // this.mailPass = pass
    this.transporter = _nodemailer2.default.createTransport({
      service: 'gmail',
      auth: {
        user: login,
        pass: pass
      }
    });
  }

  _createClass(Notification, [{
    key: 'send',
    value: function send(option) {
      Object.assign(option, { from: 'dev@feracode.com' });
      return this.transporter.sendMail(option, function (err, info) {
        return info ? _logger2.default.info('Info: ' + info.response) : _logger2.default.error('Error: ' + err);
      });
    }
  }]);

  return Notification;
}();

exports.default = Notification;