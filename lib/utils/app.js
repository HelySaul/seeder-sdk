'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _Env = require('./Env');

var _Env2 = _interopRequireDefault(_Env);

var _Token = require('./Token');

var _Token2 = _interopRequireDefault(_Token);

var _expressFileupload = require('express-fileupload');

var _expressFileupload2 = _interopRequireDefault(_expressFileupload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var token = new _Token2.default();

var whitelist = ['http://192.168.86.22:4200', 'http://192.168.86.35:4200', 'https://developferacode.smashtechnology.com'];
var options = {
  origin: function origin(_origin, callback) {
    _logger2.default.info(_origin);

    if (whitelist.indexOf(_origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use((0, _morgan2.default)(_Env2.default.HTTP_LOG_CONFIG, { stream: _logger2.default.stream }))

//.use(cors())    

.use(function (req, res, next) {
  // To use with websocket, uncomment this line below and comment the next line
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  //res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', '*');
  next();
}).use(token.httpValidate).use((0, _bodyParser.json)({ limit: '5mb' })).use((0, _bodyParser.urlencoded)({
  limit: '5mb',
  extended: false
})).use((0, _expressFileupload2.default)());

exports.default = app;