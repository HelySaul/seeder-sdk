'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GoogleStorage = function () {
  function GoogleStorage() {
    _classCallCheck(this, GoogleStorage);
  }

  _createClass(GoogleStorage, null, [{
    key: 'uploadFile',
    value: async function uploadFile(bucket, userId, fileName, file) {
      return new Promise(function (resolve, reject) {
        try {
          var bucketFile = bucket.file(userId + '/' + fileName);
          var stream = bucketFile.createWriteStream({
            metadata: {
              contentType: file.mimetype
            }
          });
          stream.on('error', function (err) {
            bucketFile.cloudStorageError = err;
            _logger2.default.error('Error uploading file : ' + JSON.stringify(err));
            reject(err);
          });
          stream.on('finish', function () {
            bucketFile.cloudStorageObject = fileName;
            //return bucketFile.makePublic().then(() => {
            //bucketFile.gcsUrl = `https://storage.googleapis.com/smash-profile-file/${userId}/{fileName}`
            resolve();
            //})
          });
          stream.end(file.data);
        } catch (error) {
          reject(error);
          _logger2.default.error('Error uploading file : ' + JSON.stringify(error));
        }
      });
    }
  }]);

  return GoogleStorage;
}();

exports.default = GoogleStorage;