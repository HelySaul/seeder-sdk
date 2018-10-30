'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeCouchdb = require('node-couchdb');

var _nodeCouchdb2 = _interopRequireDefault(_nodeCouchdb);

var _Env = require('./Env');

var _Env2 = _interopRequireDefault(_Env);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Database = function () {
  function Database() {
    _classCallCheck(this, Database);
  }

  _createClass(Database, null, [{
    key: 'connect',
    value: async function connect() {
      var dbConnection = new _nodeCouchdb2.default({
        host: _Env2.default.DB_HOST,
        port: _Env2.default.DB_PORT,
        auth: {
          user: _Env2.default.DB_USER,
          pass: _Env2.default.DB_PASS
        },
        timeout: 30000 //30 seconds
      });
      await dbConnection.listDatabases().then(function () {
        _logger2.default.info('DB found on server ' + _Env2.default.DB_HOST + ':' + _Env2.default.DB_PORT + ' ');
        _logger2.default.info('Database server: ' + _Env2.default.DB_HOST + ', DB: ' + _Env2.default.DB_NAME + ' on port ' + _Env2.default.DB_PORT + ' ');
      }).catch(function (err) {
        return Database.reconnect(err);
      });
      return dbConnection;
    }
  }, {
    key: 'updateDb',
    value: async function updateDb(couchDb, databaseName, object, partial) {
      if (!object._id) {
        throw new Error('Field "_id" is required');
      }
      var objectToUpdate = object;
      if (!objectToUpdate._rev || partial) {
        var currentObj = await couchDb.get(databaseName, object._id);
        objectToUpdate = Object.assign(currentObj.data, object);
      }
      return await couchDb.update(databaseName, objectToUpdate);
    }
  }, {
    key: 'reconnect',
    value: async function reconnect(err) {
      _logger2.default.error('Database not found: ' + err + ', trying to find in 3 seconds...');
      setTimeout(async function () {
        return await Database.connect();
      }, 3000);
    }
  }]);

  return Database;
}();

exports.default = Database;