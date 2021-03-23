var Authentication = require('./authentication');
var pjson = require('../../package.json');
var WebAuth = require('./web-auth/webauth');
var CustomException = require('./web-auth/exception');

module.exports = {
  WebAuth: WebAuth,
  CustomException:CustomException,
  Authentication: Authentication,
  Version: pjson.version
};