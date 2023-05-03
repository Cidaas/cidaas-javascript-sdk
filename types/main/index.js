"use strict";
exports.__esModule = true;
exports.Version = exports.Authentication = exports.WebAuth = void 0;
var authentication_1 = require("./authentication");
exports.Authentication = authentication_1.Authentication;
var WebAuth_1 = require("./web-auth/WebAuth");
exports.WebAuth = WebAuth_1.WebAuth;
var Version = require('../../package.json').version;
exports.Version = Version;
