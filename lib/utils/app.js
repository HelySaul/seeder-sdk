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

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var token = new _Token2.default();

/*
const whitelist = ['http://192.168.86.22:4200', 'http://192.168.86.35:4200', 'https://developferacode.smashtechnology.com']    
const options = {
  origin: function (origin, callback) {
    logger.info(origin)

    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
*/

var corsOptions = {
  origin: 'http://192.168.86.22:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use((0, _morgan2.default)(_Env2.default.HTTP_LOG_CONFIG, { stream: _logger2.default.stream })).use((0, _cors2.default)(corsOptions))

/*
.use((req, res, next) => {
  logger.info('SDK Origin -> ' + req.headers.origin)
    // To use with websocket, uncomment this line below and comment the next line
  res.header('Access-Control-Allow-Origin', 'http://192.168.86.22:4200')
  //res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})
*/

.use(token.httpValidate).use((0, _bodyParser.json)({ limit: '5mb' })).use((0, _bodyParser.urlencoded)({
  limit: '5mb',
  extended: false
})).use((0, _expressFileupload2.default)());

exports.default = app;