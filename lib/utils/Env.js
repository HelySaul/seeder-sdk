'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Env = function () {
  function Env() {
    _classCallCheck(this, Env);
  }

  _createClass(Env, null, [{
    key: 'init',
    value: function init() {
      return new Promise(function (resolve, reject) {
        var inLocalDevelopment = process.env.NODE_ENV === 'development';
        if (inLocalDevelopment) {
          _logger2.default.info('Environment: Local Development');
          _dotenv2.default.config();
          resolve();
        } else {
          var gcs = require('@google-cloud/storage')();
          var bucketName = 'envvars-smash-prj';
          var remoteFileName = void 0;
          if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
            _logger2.default.info('Environment: Remote Development');
            remoteFileName = 'backend-development.env';
          } else if (process.env.ENVIRONMENT === 'STAGING') {
            _logger2.default.info('Environment: Remote Staging');
            remoteFileName = 'backend-staging.env';
          } else if (process.env.ENVIRONMENT === 'PRODUCTION') {
            _logger2.default.info('Environment: Remote Production');
            remoteFileName = 'backend-production.env';
          }
          gcs.bucket(bucketName).file(remoteFileName).download({ destination: '.env' }).then(function () {
            _dotenv2.default.config();
            resolve();
          }).catch(function (err) {
            _logger2.default.warn(err);
            reject(err);
          });
        }
      });
    }
  }, {
    key: 'NODE_ENV',
    get: function get() {
      return process.env.NODE_ENV || 'development';
    }
  }, {
    key: 'PORT',
    get: function get() {
      return process.env.PORT || 3000;
    }
  }, {
    key: 'DB_HOST',
    get: function get() {
      return process.env.DB_HOST || 'localhost';
    }
  }, {
    key: 'DB_PORT',
    get: function get() {
      return process.env.DB_PORT || 5984;
    }
  }, {
    key: 'DB_NAME',
    get: function get() {
      return process.env.DB_NAME || 'example';
    }
  }, {
    key: 'DB_USER',
    get: function get() {
      return process.env.DB_USER || 'admin';
    }
  }, {
    key: 'DB_PASS',
    get: function get() {
      return process.env.DB_PASS || 'pass';
    }
  }, {
    key: 'HTTP_LOG_CONFIG',
    get: function get() {
      return process.env.HTTP_LOG_CONFIG || 'combined';
    }
  }, {
    key: 'SECRET',
    get: function get() {
      return process.env.SECRET || 'feracodebr';
    }
  }]);

  return Env;
}();

exports.default = Env;