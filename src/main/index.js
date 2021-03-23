var Authentication = require('./authentication');
var WebAuth = require('./web-auth');
var pjson = require('../../package.json');
var CustomException = require('./web-auth/exception');

module.exports = {
  Authentication: Authentication,
  WebAuth: WebAuth,
  Version: pjson.version,
  CustomException: CustomException
};