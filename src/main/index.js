var Authentication = require('./authentication');
var WebAuth = require('./web-auth');
var version = require('./version');
var CustomException = require('./web-auth/exception');

module.exports = {
  Authentication: Authentication,
  WebAuth: WebAuth,
  Version: version.raw,
  CustomException: CustomException
};