'use strict';

var _split = require('split');

var _split2 = _interopRequireDefault(_split);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var combine = _winston.format.combine;


var consoleConfig = {
  level: 'info',
  handleExceptions: true,
  format: combine(_winston2.default.format.colorize(), _winston2.default.format.simple())
};

var loggerTransports = new _winston2.default.transports.Console(consoleConfig);

var logger = _winston2.default.createLogger({
  transports: [loggerTransports],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = (0, _split2.default)().on('data', function (message) {
  return logger.info(message);
});