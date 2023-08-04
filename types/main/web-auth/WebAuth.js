"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.WebAuth = void 0;
var oidc_client_ts_1 = require("oidc-client-ts");
var CryptoJS = require("crypto-js");
var fingerprintjs_1 = require("@fingerprintjs/fingerprintjs");
var authentication_1 = require("../authentication");
var Helper_1 = require("./Helper");
var LoginService_1 = require("./LoginService");
var UserService_1 = require("./UserService");
var TokenService_1 = require("./TokenService");
var VerificationService_1 = require("./VerificationService");
var ConsentService_1 = require("./ConsentService");
var WebAuth = /** @class */ (function () {
    function WebAuth(settings) {
        try {
            var usermanager = new oidc_client_ts_1.UserManager(settings);
            window.webAuthSettings = settings;
            window.usermanager = usermanager;
            window.localeSettings = null;
            window.authentication = new authentication_1.Authentication(window.webAuthSettings, window.usermanager);
            window.usermanager.events.addSilentRenewError(function (error) {
                throw new Helper_1.CustomException("Error while renewing silent login", 500);
            });
            if (!settings.mode) {
                window.webAuthSettings.mode = 'redirect';
            }
        }
        catch (ex) {
            console.log(ex);
        }
    }
    /**
   * @param string
   * @returns
   */
    WebAuth.prototype.base64URL = function (string) {
        return string.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    };
    ;
    // prototype methods 
    /**
     * login
     */
    WebAuth.prototype.loginWithBrowser = function () {
        try {
            if (!window.webAuthSettings && !window.authentication) {
                throw new Helper_1.CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
            }
            switch (window.webAuthSettings.mode) {
                case 'redirect':
                    window.authentication.redirectSignIn('login');
                    break;
                case 'window':
                    window.authentication.popupSignIn();
                    break;
                case 'silent':
                    window.authentication.silentSignIn();
                    break;
            }
        }
        catch (ex) {
            console.log(ex);
        }
    };
    ;
    /**
     * register
     */
    WebAuth.prototype.registerWithBrowser = function () {
        try {
            if (!window.webAuthSettings && !window.authentication) {
                throw new Helper_1.CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
            }
            switch (window.webAuthSettings.mode) {
                case 'redirect':
                    window.authentication.redirectSignIn('register');
                    break;
                case 'window':
                    window.authentication.popupSignIn();
                    break;
                case 'silent':
                    window.authentication.silentSignIn();
                    break;
            }
        }
        catch (ex) {
            console.log(ex);
        }
    };
    ;
    /**
     * login callback
     * @returns
     */
    WebAuth.prototype.loginCallback = function () {
        return new Promise(function (resolve, reject) {
            try {
                if (!window.webAuthSettings && !window.authentication) {
                    throw new Helper_1.CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
                }
                switch (window.webAuthSettings.mode) {
                    case 'redirect':
                        window.authentication.redirectSignInCallback().then(function (user) {
                            resolve(user);
                        })["catch"](function (ex) {
                            reject(ex);
                        });
                        break;
                    case 'window':
                        window.authentication.popupSignInCallback();
                        break;
                    case 'silent':
                        window.authentication.silentSignInCallbackV2().then(function (data) {
                            resolve(data);
                        })["catch"](function (error) {
                            reject(error);
                        });
                        break;
                }
            }
            catch (ex) {
                console.log(ex);
            }
        });
    };
    ;
    /**
     * get user info
     * @returns
     */
    WebAuth.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!window.usermanager) return [3 /*break*/, 2];
                        return [4 /*yield*/, window.usermanager.getUser()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: throw new Helper_1.CustomException("UserManager cannot be empty", 417);
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        throw e_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ;
    /**
     * logout
     * @returns
     */
    WebAuth.prototype.logout = function () {
        return new Promise(function (resolve, reject) {
            try {
                if (!window.webAuthSettings && !window.authentication) {
                    throw new Helper_1.CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
                }
                if (window.webAuthSettings.mode == 'redirect') {
                    window.authentication.redirectSignOut().then(function (result) {
                        resolve(result);
                        return;
                    });
                }
                else if (window.webAuthSettings.mode == 'window') {
                    window.authentication.popupSignOut();
                }
                else if (window.webAuthSettings.mode == 'silent') {
                    window.authentication.redirectSignOut();
                }
                else {
                    resolve(undefined);
                }
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ;
    /**
     * logout callback
     * @returns
     */
    WebAuth.prototype.logoutCallback = function () {
        return new Promise(function (resolve, reject) {
            try {
                if (!window.webAuthSettings && !window.authentication) {
                    throw new Helper_1.CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
                }
                if (window.webAuthSettings.mode == 'redirect') {
                    window.authentication.redirectSignOutCallback().then(function (resp) {
                        resolve(resp);
                    });
                }
                else if (window.webAuthSettings.mode == 'window') {
                    window.authentication.popupSignOutCallback();
                }
                else if (window.webAuthSettings.mode == 'silent') {
                    window.authentication.redirectSignOutCallback();
                }
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ;
    /**
     * get login url
     * @returns
     */
    WebAuth.prototype.getLoginURL = function () {
        var settings = window.webAuthSettings;
        if (!settings.response_type) {
            settings.response_type = "code";
        }
        if (!settings.scope) {
            settings.scope = "email openid profile mobile";
        }
        var loginURL = "";
        window.usermanager._client.createSigninRequest(settings).then(function (signInRequest) {
            loginURL = signInRequest.url;
        });
        var timeRemaining = 5000;
        while (timeRemaining > 0) {
            if (loginURL) {
                break;
            }
            setTimeout(function () {
                timeRemaining -= 100;
            }, 100);
        }
        return loginURL;
    };
    ;
    /**
     * get request id
     * @returns
     */
    WebAuth.prototype.getRequestId = function () {
        return new Promise(function (resolve, reject) {
            try {
                var respone_type = window.webAuthSettings.response_type;
                if (!respone_type) {
                    respone_type = "token";
                }
                var response_mode = window.webAuthSettings.response_mode;
                if (!response_mode) {
                    response_mode = "fragment";
                }
                var bodyParams = {
                    "client_id": window.webAuthSettings.client_id,
                    "redirect_uri": window.webAuthSettings.redirect_uri,
                    "response_type": respone_type,
                    "response_mode": response_mode,
                    "scope": window.webAuthSettings.scope,
                    "nonce": new Date().getTime().toString()
                };
                var http = new XMLHttpRequest();
                var _serviceURL = window.webAuthSettings.authority + "/authz-srv/authrequest/authz/generate";
                http.onreadystatechange = function () {
                    if (http.readyState == 4) {
                        if (http.responseText) {
                            resolve(JSON.parse(http.responseText));
                        }
                        else {
                            resolve(false);
                        }
                    }
                };
                http.open("POST", _serviceURL, true);
                http.setRequestHeader("Content-type", "application/json");
                if (window.localeSettings) {
                    http.setRequestHeader("accept-language", window.localeSettings);
                }
                http.send(JSON.stringify(bodyParams));
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ;
    /**
     * get missing fields
     * @param options
     * @returns
     */
    WebAuth.prototype.getMissingFields = function (options) {
        return new Promise(function (resolve, reject) {
            try {
                var http = new XMLHttpRequest();
                var _serviceURL = window.webAuthSettings.authority + "/public-srv/public/trackinfo/" + options.requestId + "/" + options.trackId;
                http.onreadystatechange = function () {
                    if (http.readyState == 4) {
                        if (http.responseText) {
                            resolve(JSON.parse(http.responseText));
                        }
                        else {
                            resolve(false);
                        }
                    }
                };
                http.open("GET", _serviceURL, true);
                http.setRequestHeader("Content-type", "application/json");
                if (window.localeSettings) {
                    http.setRequestHeader("accept-language", window.localeSettings);
                }
                http.send();
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ;
    /**
     * get Tenant info
     * @returns
     */
    WebAuth.prototype.getTenantInfo = function () {
        return new Promise(function (resolve, reject) {
            try {
                var http = new XMLHttpRequest();
                var _serviceURL = window.webAuthSettings.authority + "/public-srv/tenantinfo/basic";
                http.onreadystatechange = function () {
                    if (http.readyState == 4) {
                        if (http.responseText) {
                            resolve(JSON.parse(http.responseText));
                        }
                        else {
                            resolve(false);
                        }
                    }
                };
                http.open("GET", _serviceURL, true);
                http.setRequestHeader("Content-type", "application/json");
                if (window.localeSettings) {
                    http.setRequestHeader("accept-language", window.localeSettings);
                }
                http.send();
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ;
    /**
     * logout api call
     * @param options
     */
    WebAuth.prototype.logoutUser = function (options) {
        try {
            window.location.href = window.webAuthSettings.authority + "/session/end_session?access_token_hint=" + options.access_token + "&post_logout_redirect_uri=" + window.webAuthSettings.post_logout_redirect_uri;
        }
        catch (ex) {
            throw new Helper_1.CustomException(ex, 417);
        }
    };
    ;
    /**
     * get Client Info
     * @param options
     * @returns
     */
    WebAuth.prototype.getClientInfo = function (options) {
        return new Promise(function (resolve, reject) {
            try {
                var http = new XMLHttpRequest();
                var _serviceURL = window.webAuthSettings.authority + "/public-srv/public/" + options.requestId;
                http.onreadystatechange = function () {
                    if (http.readyState == 4) {
                        if (http.responseText) {
                            resolve(JSON.parse(http.responseText));
                        }
                        else {
                            resolve(false);
                        }
                    }
                };
                http.open("GET", _serviceURL, true);
                http.setRequestHeader("Content-type", "application/json");
                if (window.localeSettings) {
                    http.setRequestHeader("accept-language", window.localeSettings);
                }
                http.send();
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ;
    /**
     * get all devices associated to the client
     * @param options
     * @returns
     */
    WebAuth.prototype.getDevicesInfo = function (options) {
        return new Promise(function (resolve, reject) {
            try {
                var http = new XMLHttpRequest();
                var _serviceURL = window.webAuthSettings.authority + "/device-srv/devices";
                options.userAgent = window.navigator.userAgent;
                http.onreadystatechange = function () {
                    if (http.readyState == 4) {
                        if (http.responseText) {
                            resolve(JSON.parse(http.responseText));
                        }
                        else {
                            resolve(false);
                        }
                    }
                };
                http.open("GET", _serviceURL, true);
                http.setRequestHeader("Content-type", "application/json");
                if (window.localeSettings) {
                    http.setRequestHeader("accept-language", window.localeSettings);
                }
                if (window.navigator.userAgent) {
                    http.send(JSON.stringify(options));
                }
                http.send();
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ;
    /**
     * delete a device
     * @param options
     * @returns
     */
    WebAuth.prototype.deleteDevice = function (options) {
        return new Promise(function (resolve, reject) {
            try {
                var http = new XMLHttpRequest();
                var _serviceURL = window.webAuthSettings.authority + "/device-srv/device/" + options.device_id;
                options.userAgent = window.navigator.userAgent;
                http.onreadystatechange = function () {
                    if (http.readyState == 4) {
                        if (http.responseText) {
                            resolve(JSON.parse(http.responseText));
                        }
                        else {
                            resolve(false);
                        }
                    }
                };
                http.open("DELETE", _serviceURL, true);
                http.setRequestHeader("Content-type", "application/json");
                if (window.localeSettings) {
                    http.setRequestHeader("accept-language", window.localeSettings);
                }
                if (window.navigator.userAgent) {
                    http.send(JSON.stringify(options));
                }
                http.send();
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ;
    /**
     * get Registration setup
     * @param options
     * @returns
     */
    WebAuth.prototype.getRegistrationSetup = function (options) {
        return new Promise(function (resolve, reject) {
            try {
                var http = new XMLHttpRequest();
                var _serviceURL = window.webAuthSettings.authority + "/registration-setup-srv/public/list?acceptlanguage=" + options.acceptlanguage + "&requestId=" + options.requestId;
                http.onreadystatechange = function () {
                    if (http.readyState == 4) {
                        if (http.responseText) {
                            var parsedResponse = JSON.parse(http.responseText);
                            if (parsedResponse && parsedResponse.data && parsedResponse.data.length > 0) {
                                var registrationFields = parsedResponse.data;
                            }
                            resolve(parsedResponse);
                        }
                        else {
                            resolve(false);
                        }
                    }
                };
                http.open("GET", _serviceURL, true);
                http.setRequestHeader("Content-type", "application/json");
                if (window.localeSettings) {
                    http.setRequestHeader("accept-language", window.localeSettings);
                }
                http.send();
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ;
    /**
   * get unreviewed devices
   * @param access_token
   * @param sub
   * @returns
   */
    WebAuth.prototype.getUnreviewedDevices = function (access_token, sub) {
        return new Promise(function (resolve, reject) {
            try {
                var http = new XMLHttpRequest();
                var _serviceURL = window.webAuthSettings.authority + "/reports-srv/device/unreviewlist/" + sub;
                http.onreadystatechange = function () {
                    if (http.readyState == 4) {
                        if (http.responseText) {
                            resolve(JSON.parse(http.responseText));
                        }
                        else {
                            resolve(false);
                        }
                    }
                };
                http.open("GET", _serviceURL, true);
                http.setRequestHeader("Content-type", "application/json");
                http.setRequestHeader("Authorization", "Bearer ".concat(access_token));
                if (window.localeSettings) {
                    http.setRequestHeader("accept-language", window.localeSettings);
                }
                http.send();
            }
            catch (ex) {
                throw new Helper_1.CustomException(ex, 417);
            }
        });
    };
    ;
    /**
     * get reviewed devices
     * @param access_token
     * @param sub
     * @returns
     */
    WebAuth.prototype.getReviewedDevices = function (access_token, sub) {
        return new Promise(function (resolve, reject) {
            try {
                var http = new XMLHttpRequest();
                var _serviceURL = window.webAuthSettings.authority + "/reports-srv/device/reviewlist/" + sub;
                http.onreadystatechange = function () {
                    if (http.readyState == 4) {
                        if (http.responseText) {
                            resolve(JSON.parse(http.responseText));
                        }
                        else {
                            resolve(false);
                        }
                    }
                };
                http.open("GET", _serviceURL, true);
                http.setRequestHeader("Content-type", "application/json");
                http.setRequestHeader("Authorization", "Bearer ".concat(access_token));
                if (window.localeSettings) {
                    http.setRequestHeader("accept-language", window.localeSettings);
                }
                http.send();
            }
            catch (ex) {
                throw new Helper_1.CustomException(ex, 417);
            }
        });
    };
    ;
    /**
     * review device
     * @param options
     * @param access_token
     * @returns
     */
    WebAuth.prototype.reviewDevice = function (options, access_token) {
        return new Promise(function (resolve, reject) {
            try {
                var http = new XMLHttpRequest();
                var _serviceURL = window.webAuthSettings.authority + "/reports-srv/device/updatereview";
                http.onreadystatechange = function () {
                    if (http.readyState == 4) {
                        if (http.responseText) {
                            resolve(JSON.parse(http.responseText));
                        }
                        else {
                            resolve(false);
                        }
                    }
                };
                http.open("PUT", _serviceURL, true);
                http.setRequestHeader("Content-type", "application/json");
                http.setRequestHeader("Authorization", "Bearer ".concat(access_token));
                if (window.localeSettings) {
                    http.setRequestHeader("accept-language", window.localeSettings);
                }
                http.send(JSON.stringify(options));
            }
            catch (ex) {
                throw new Helper_1.CustomException(ex, 417);
            }
        });
    };
    ;
    /**
     * get device info
     * @returns
     */
    WebAuth.prototype.getDeviceInfo = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var value = ('; ' + document.cookie).split("; cidaas_dr=").pop().split(';')[0];
                var fpPromise = fingerprintjs_1["default"].load();
                var options = { fingerprint: "", userAgent: "" };
                if (!value) {
                    (function () { return __awaiter(_this, void 0, void 0, function () {
                        var fp, result, http, _serviceURL;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, fpPromise];
                                case 1:
                                    fp = _a.sent();
                                    return [4 /*yield*/, fp.get()];
                                case 2:
                                    result = _a.sent();
                                    options.fingerprint = result.visitorId;
                                    options.userAgent = window.navigator.userAgent;
                                    http = new XMLHttpRequest();
                                    _serviceURL = window.webAuthSettings.authority + "/device-srv/deviceinfo";
                                    http.onreadystatechange = function () {
                                        if (http.readyState == 4) {
                                            resolve(JSON.parse(http.responseText));
                                        }
                                    };
                                    http.open("POST", _serviceURL, true);
                                    http.setRequestHeader("Content-type", "application/json");
                                    if (window.localeSettings) {
                                        http.setRequestHeader("accept-language", window.localeSettings);
                                    }
                                    http.send(JSON.stringify(options));
                                    return [2 /*return*/];
                            }
                        });
                    }); })();
                }
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ;
    /**
    * get user info
    * @param options
    * @returns
    */
    WebAuth.prototype.getUserProfile = function (options) {
        return UserService_1.UserService.getUserProfile(options);
    };
    ;
    /**
     * renew token using refresh token
     * @param options
     * @returns
     */
    WebAuth.prototype.renewToken = function (options) {
        return TokenService_1.TokenService.renewToken(options);
    };
    ;
    /**
     * get access token from code
     * @param options
     * @returns
     */
    WebAuth.prototype.getAccessToken = function (options) {
        return TokenService_1.TokenService.getAccessToken(options);
    };
    ;
    /**
     * validate access token
     * @param options
     * @returns
     */
    WebAuth.prototype.validateAccessToken = function (options) {
        return TokenService_1.TokenService.validateAccessToken(options);
    };
    ;
    /**
     * login with username and password
     * @param options
     */
    WebAuth.prototype.loginWithCredentials = function (options) {
        LoginService_1.LoginService.loginWithCredentials(options);
    };
    ;
    /**
     * login with username and password and return response
     * @param options
     * @returns
     */
    WebAuth.prototype.loginWithCredentialsAsynFn = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, LoginService_1.LoginService.loginWithCredentialsAsynFn(options)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    /**
     * login with social
     * @param options
     * @param queryParams
     */
    WebAuth.prototype.loginWithSocial = function (options, queryParams) {
        LoginService_1.LoginService.loginWithSocial(options, queryParams);
    };
    ;
    /**
     * register with social
     * @param options
     * @param queryParams
     */
    WebAuth.prototype.registerWithSocial = function (options, queryParams) {
        LoginService_1.LoginService.registerWithSocial(options, queryParams);
    };
    ;
    /**
     * register user
     * @param options
     * @param headers
     * @returns
     */
    WebAuth.prototype.register = function (options, headers) {
        return UserService_1.UserService.register(options, headers);
    };
    ;
    /**
     * get invite info
     * @param options
     * @returns
     */
    WebAuth.prototype.getInviteUserDetails = function (options) {
        return UserService_1.UserService.getInviteUserDetails(options);
    };
    ;
    /**
     * get Communication status
     * @param options
     * @returns
     */
    WebAuth.prototype.getCommunicationStatus = function (options) {
        return UserService_1.UserService.getCommunicationStatus(options);
    };
    ;
    /**
     * initiate verification
     * @param options
     * @returns
     */
    WebAuth.prototype.initiateAccountVerification = function (options) {
        VerificationService_1.VerificationService.initiateAccountVerification(options);
    };
    ;
    /**
     * initiate verification and return response
     * @param options
     * @returns
     */
    WebAuth.prototype.initiateAccountVerificationAsynFn = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, VerificationService_1.VerificationService.initiateAccountVerificationAsynFn(options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ;
    /**
     * verify account
     * @param options
     * @returns
     */
    WebAuth.prototype.verifyAccount = function (options) {
        return VerificationService_1.VerificationService.verifyAccount(options);
    };
    ;
    /**
     * initiate reset password
     * @param options
     * @returns
     */
    WebAuth.prototype.initiateResetPassword = function (options) {
        return UserService_1.UserService.initiateResetPassword(options);
    };
    ;
    /**
     * handle reset password
     * @param options
     */
    WebAuth.prototype.handleResetPassword = function (options) {
        return UserService_1.UserService.handleResetPassword(options);
    };
    ;
    /**
    * reset password
    * @param options
    */
    WebAuth.prototype.resetPassword = function (options) {
        return UserService_1.UserService.resetPassword(options);
    };
    ;
    /**
     * get mfa list v2
     * @param options
     * @returns
     */
    WebAuth.prototype.getMFAListV2 = function (options) {
        return VerificationService_1.VerificationService.getMFAListV2(options);
    };
    ;
    /**
     * cancel mfa v2
     * @param options
     * @returns
     */
    WebAuth.prototype.cancelMFAV2 = function (options) {
        return VerificationService_1.VerificationService.cancelMFAV2(options);
    };
    ;
    /**
     * passwordless login
     * @param options
     */
    WebAuth.prototype.passwordlessLogin = function (options) {
        LoginService_1.LoginService.passwordlessLogin(options);
    };
    ;
    /**
     * get user consent details
     * @param options
     * @returns
     */
    WebAuth.prototype.getConsentDetailsV2 = function (options) {
        return ConsentService_1.ConsentService.getConsentDetailsV2(options);
    };
    ;
    /**
     * accept consent v2
     * @param options
     * @returns
     */
    WebAuth.prototype.acceptConsentV2 = function (options) {
        return ConsentService_1.ConsentService.acceptConsentV2(options);
    };
    ;
    /**
     * get scope consent details
     * @param options
     * @returns
     */
    WebAuth.prototype.getScopeConsentDetails = function (options) {
        return TokenService_1.TokenService.getScopeConsentDetails(options);
    };
    ;
    /**
     * get scope consent version details
     * @param options
     * @returns
     */
    WebAuth.prototype.getScopeConsentVersionDetailsV2 = function (options) {
        return ConsentService_1.ConsentService.getScopeConsentVersionDetailsV2(options);
    };
    ;
    /**
     * accept scope Consent
     * @param options
     * @returns
     */
    WebAuth.prototype.acceptScopeConsent = function (options) {
        return ConsentService_1.ConsentService.acceptScopeConsent(options);
    };
    ;
    /**
     * scope consent continue login
     * @param options
     */
    WebAuth.prototype.scopeConsentContinue = function (options) {
        LoginService_1.LoginService.scopeConsentContinue(options);
    };
    ;
    /**
     * accept claim Consent
     * @param options
     * @returns
     */
    WebAuth.prototype.acceptClaimConsent = function (options) {
        return ConsentService_1.ConsentService.acceptClaimConsent(options);
    };
    ;
    /**
     * claim consent continue login
     * @param options
     */
    WebAuth.prototype.claimConsentContinue = function (options) {
        LoginService_1.LoginService.claimConsentContinue(options);
    };
    ;
    /**
     * revoke claim Consent
     * @param options
     * @returns
     */
    WebAuth.prototype.revokeClaimConsent = function (options) {
        return ConsentService_1.ConsentService.revokeClaimConsent(options);
    };
    ;
    /**
     * get Deduplication details
     * @param options
     * @returns
     */
    WebAuth.prototype.getDeduplicationDetails = function (options) {
        return UserService_1.UserService.getDeduplicationDetails(options);
    };
    ;
    /**
     * deduplication login
     * @param options
     */
    WebAuth.prototype.deduplicationLogin = function (options) {
        UserService_1.UserService.deduplicationLogin(options);
    };
    ;
    /**
     * register Deduplication
     * @param options
     * @returns
     */
    WebAuth.prototype.registerDeduplication = function (options) {
        return UserService_1.UserService.registerDeduplication(options);
    };
    ;
    /**
     * accepts any as the request
     * consent continue login
     * @param options
     */
    WebAuth.prototype.consentContinue = function (options) {
        LoginService_1.LoginService.consentContinue(options);
    };
    ;
    /**
     * mfa continue login
     * @param options
     */
    WebAuth.prototype.mfaContinue = function (options) {
        LoginService_1.LoginService.mfaContinue(options);
    };
    ;
    /**
     * change password continue
     * @param options
     */
    WebAuth.prototype.firstTimeChangePassword = function (options) {
        LoginService_1.LoginService.firstTimeChangePassword(options);
    };
    ;
    /**
     * change password
     * @param options
     * @param access_token
     * @returns
     */
    WebAuth.prototype.changePassword = function (options, access_token) {
        return UserService_1.UserService.changePassword(options, access_token);
    };
    ;
    /**
     * update profile
     * @param options
     * @param access_token
     * @param sub
     * @returns
     */
    WebAuth.prototype.updateProfile = function (options, access_token, sub) {
        return UserService_1.UserService.updateProfile(options, access_token, sub);
    };
    ;
    /**
     * get user activities
     * @param options
     * @param access_token
     * @returns
     */
    WebAuth.prototype.getUserActivities = function (options, access_token) {
        var _serviceURL = window.webAuthSettings.authority + "/useractivity-srv/latestactivity";
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, access_token);
    };
    ;
    /**
     * @param access_token
     * @returns
     */
    WebAuth.prototype.getAllVerificationList = function (access_token) {
        return VerificationService_1.VerificationService.getAllVerificationList(access_token);
    };
    ;
    /**
     * initiate link accoount
     * @param options
     * @param access_token
     * @returns
     */
    WebAuth.prototype.initiateLinkAccount = function (options, access_token) {
        return UserService_1.UserService.initiateLinkAccount(options, access_token);
    };
    ;
    /**
     * complete link accoount
     * @param options
     * @param access_token
     * @returns
     */
    WebAuth.prototype.completeLinkAccount = function (options, access_token) {
        return UserService_1.UserService.completeLinkAccount(options, access_token);
    };
    ;
    /**
     * get linked users
     * @param access_token
     * @param sub
     * @returns
     */
    WebAuth.prototype.getLinkedUsers = function (access_token, sub) {
        return UserService_1.UserService.getLinkedUsers(access_token, sub);
    };
    ;
    /**
     * unlink accoount
     * @param access_token
     * @param identityId
     * @returns
     */
    WebAuth.prototype.unlinkAccount = function (access_token, identityId) {
        return UserService_1.UserService.unlinkAccount(access_token, identityId);
    };
    ;
    /**
     * image upload
     * @param options
     * @param access_token
     * @returns
     */
    WebAuth.prototype.updateProfileImage = function (options, access_token) {
        var _serviceURL = window.webAuthSettings.authority + "/image-srv/profile/upload";
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, access_token);
    };
    ;
    /**
     * updateSuggestMFA
     * @param track_id
     * @param options
     * @returns
     */
    WebAuth.prototype.updateSuggestMFA = function (track_id, options) {
        return TokenService_1.TokenService.updateSuggestMFA(track_id, options);
    };
    ;
    /**
     * enrollVerification
     * @param options
     * @returns
     */
    WebAuth.prototype.enrollVerification = function (options) {
        return VerificationService_1.VerificationService.enrollVerification(options);
    };
    ;
    /**
     * @deprecated This function is no longer supported, instead use {this.updateStatus()}
     * @param status_id
     * @returns
     */
    WebAuth.prototype.updateSocket = function (status_id) {
        return VerificationService_1.VerificationService.updateStatus(status_id);
    };
    ;
    /**
     * update the status of notification
     * @param status_id
     * @returns
     */
    WebAuth.prototype.updateStatus = function (status_id) {
        return VerificationService_1.VerificationService.updateStatus(status_id);
    };
    ;
    /**
     * setupFidoVerification
     * @param options
     * @returns
     */
    WebAuth.prototype.setupFidoVerification = function (options) {
        return VerificationService_1.VerificationService.setupFidoVerification(options);
    };
    ;
    /**
     * checkVerificationTypeConfigured
     * @param options
     * @returns
     */
    WebAuth.prototype.checkVerificationTypeConfigured = function (options) {
        return VerificationService_1.VerificationService.checkVerificationTypeConfigured(options);
    };
    ;
    /**
     * deleteUserAccount
     * @param options
     * @returns
     */
    WebAuth.prototype.deleteUserAccount = function (options) {
        return UserService_1.UserService.deleteUserAccount(options);
    };
    ;
    /**
     * getMissingFieldsLogin
     * @param trackId
     * @returns
     */
    WebAuth.prototype.getMissingFieldsLogin = function (trackId) {
        return TokenService_1.TokenService.getMissingFieldsLogin(trackId);
    };
    ;
    /**
     * progressiveRegistration
     * @param options
     * @param headers
     * @returns
     */
    WebAuth.prototype.progressiveRegistration = function (options, headers) {
        return LoginService_1.LoginService.progressiveRegistration(options, headers);
    };
    ;
    /**
     * loginAfterRegister
     * @param options
     */
    WebAuth.prototype.loginAfterRegister = function (options) {
        LoginService_1.LoginService.loginAfterRegister(options);
    };
    ;
    /**
     * device code flow - verify
     * @param code
     */
    WebAuth.prototype.deviceCodeVerify = function (code) {
        TokenService_1.TokenService.deviceCodeVerify(code);
    };
    /**
     * check if an user exists
     * @param options
     * @returns
     */
    WebAuth.prototype.userCheckExists = function (options) {
        return UserService_1.UserService.userCheckExists(options);
    };
    ;
    /**
     * To set accept language
     * @param acceptLanguage
     */
    WebAuth.prototype.setAcceptLanguageHeader = function (acceptLanguage) {
        window.localeSettings = acceptLanguage;
    };
    /**
     * initiate mfa v2
     * @param options
     * @returns
     */
    WebAuth.prototype.initiateMFAV2 = function (options) {
        return VerificationService_1.VerificationService.initiateMFAV2(options);
    };
    ;
    /**
     * initiateVerification
     * @param options
     */
    WebAuth.prototype.initiateVerification = function (options) {
        options.type = options.verification_type;
        this.initiateMFAV2(options);
    };
    ;
    /**
     * initiate email v2
     * @param options
     */
    WebAuth.prototype.initiateEmailV2 = function (options) {
        options.type = "email";
        this.initiateMFAV2(options);
    };
    ;
    /**
     * initiate sms v2
     * @param options
     */
    WebAuth.prototype.initiateSMSV2 = function (options) {
        options.type = "sms";
        this.initiateMFAV2(options);
    };
    ;
    /**
     * initiate ivr v2
     * @param options
     */
    WebAuth.prototype.initiateIVRV2 = function (options) {
        options.type = "ivr";
        this.initiateMFAV2(options);
    };
    ;
    /**
     * initiate backupcode v2
     * @param options
     */
    WebAuth.prototype.initiateBackupcodeV2 = function (options) {
        options.type = "backupcode";
        this.initiateMFAV2(options);
    };
    ;
    /**
     * initiate totp v2
     * @param options
     */
    WebAuth.prototype.initiateTOTPV2 = function (options) {
        options.type = "totp";
        this.initiateMFAV2(options);
    };
    ;
    /**
     * initiate pattern v2
     * @param options
     */
    WebAuth.prototype.initiatePatternV2 = function (options) {
        options.type = "pattern";
        this.initiateMFAV2(options);
    };
    ;
    /**
     * initiate touchid v2
     * @param options
     */
    WebAuth.prototype.initiateTouchIdV2 = function (options) {
        options.type = "touchid";
        this.initiateMFAV2(options);
    };
    ;
    /**
     * initiate smart push v2
     * @param options
     */
    WebAuth.prototype.initiateSmartPushV2 = function (options) {
        options.type = "push";
        this.initiateMFAV2(options);
    };
    ;
    /**
     * initiate face v2
     * @param options
     */
    WebAuth.prototype.initiateFaceV2 = function (options) {
        options.type = "face";
        this.initiateMFAV2(options);
    };
    ;
    /**
     * initiate voice v2
     * @param options
     */
    WebAuth.prototype.initiateVoiceV2 = function (options) {
        options.type = "voice";
        this.initiateMFAV2(options);
    };
    ;
    /**
     * @deprecated
     * @param options
     * @param verificationType
     * @returns
     */
    WebAuth.prototype.initiateMfaV1 = function (options, verificationType) {
        return VerificationService_1.VerificationService.initiateMfaV1(options, verificationType);
    };
    /**
    * @deprecated
    * initiate email - v1
    * @param options
    */
    WebAuth.prototype.initiateEmail = function (options) {
        var verificationType = "EMAIL";
        this.initiateMfaV1(options, verificationType);
    };
    ;
    /**
    * @deprecated
    * initiate SMS - v1
    * @param options
    */
    WebAuth.prototype.initiateSMS = function (options) {
        var verificationType = "SMS";
        this.initiateMfaV1(options, verificationType);
    };
    ;
    /**
    * @deprecated
    * initiate IVR - v1
    * @param options
    */
    WebAuth.prototype.initiateIVR = function (options) {
        var verificationType = "IVR";
        this.initiateMfaV1(options, verificationType);
    };
    ;
    /**
    * @deprecated
    * initiate backup code - v1
    * @param options
    */
    WebAuth.prototype.initiateBackupcode = function (options) {
        var verificationType = "BACKUPCODE";
        this.initiateMfaV1(options, verificationType);
    };
    ;
    /**
     * @deprecated
     * initiate TOTP - v1
     * @param options
     */
    WebAuth.prototype.initiateTOTP = function (options) {
        var verificationType = "TOTP";
        this.initiateMfaV1(options, verificationType);
    };
    ;
    /**
    * @deprecated
    * initiate pattern - v1
    * @param options
    */
    WebAuth.prototype.initiatePattern = function (options) {
        var verificationType = "PATTERN";
        this.initiateMfaV1(options, verificationType);
    };
    ;
    /**
    * @deprecated
    * initiate touchid - v1
    * @param options
    */
    WebAuth.prototype.initiateTouchId = function (options) {
        var verificationType = "TOUCHID";
        this.initiateMfaV1(options, verificationType);
    };
    ;
    /**
      * @deprecated
      * initiate push - v1
      * @param options
      */ WebAuth.prototype.initiateSmartPush = function (options) {
        var verificationType = "PUSH";
        this.initiateMfaV1(options, verificationType);
    };
    ;
    /**
    * @deprecated
    * initiate face - v1
    * @param options
    */
    WebAuth.prototype.initiateFace = function (options) {
        var verificationType = "FACE";
        this.initiateMfaV1(options, verificationType);
    };
    ;
    /**
     * @deprecated
     * initiate Voice - v1
     * @param options
     */
    WebAuth.prototype.initiateVoice = function (options) {
        var verificationType = "VOICE";
        this.initiateMfaV1(options, verificationType);
    };
    ;
    /**
     * authenticate mfa v2
     * @param options
     * @returns
     */
    WebAuth.prototype.authenticateMFAV2 = function (options) {
        return VerificationService_1.VerificationService.authenticateMFAV2(options);
    };
    ;
    /**
     * authenticateVerification
     * @param options
     */
    WebAuth.prototype.authenticateVerification = function (options) {
        options.type = options.verification_type;
        this.authenticateMFAV2(options);
    };
    ;
    /**
     * authenticate email v2
     * @param options
     */
    WebAuth.prototype.authenticateEmailV2 = function (options) {
        options.type = "email";
        this.authenticateMFAV2(options);
    };
    ;
    /**
     * authenticate sms v2
     * @param options
     */
    WebAuth.prototype.authenticateSMSV2 = function (options) {
        options.type = "sms";
        this.authenticateMFAV2(options);
    };
    ;
    /**
     * authenticate ivr v2
     * @param options
     */
    WebAuth.prototype.authenticateIVRV2 = function (options) {
        options.type = "ivr";
        this.authenticateMFAV2(options);
    };
    ;
    /**
     * authenticate backupcode v2
     * @param options
     */
    WebAuth.prototype.authenticateBackupcodeV2 = function (options) {
        options.type = "backupcode";
        this.authenticateMFAV2(options);
    };
    ;
    /**
     * authenticate totp v2
     * @param options
     */
    WebAuth.prototype.authenticateTOTPV2 = function (options) {
        options.type = "totp";
        this.authenticateMFAV2(options);
    };
    ;
    /**
     * authenticateVerification form type (for face)
     * @param options
     * @returns
     */
    WebAuth.prototype.authenticateFaceVerification = function (options) {
        return VerificationService_1.VerificationService.authenticateFaceVerification(options);
    };
    ;
    /**
     * @deprecated
     * setup verification - v1
     * @param options
     * @param access_token
     * @param verificationType
     * @returns
     */
    WebAuth.prototype.setupVerificationV1 = function (options, access_token, verificationType) {
        return VerificationService_1.VerificationService.setupVerificationV1(options, access_token, verificationType);
    };
    /**
     * @deprecated
     * setup email - v1
     * @param options
     * @param access_token
     */
    WebAuth.prototype.setupEmail = function (options, access_token) {
        var verificationType = "EMAIL";
        this.setupVerificationV1(options, access_token, verificationType);
    };
    ;
    /**
     * @deprecated
     * setup sms - v1
     * @param options
     * @param access_token
     */
    WebAuth.prototype.setupSMS = function (options, access_token) {
        var verificationType = "SMS";
        this.setupVerificationV1(options, access_token, verificationType);
    };
    ;
    /**
     * @deprecated
     * setup ivr - v1
     * @param options
     * @param access_token
     */
    WebAuth.prototype.setupIVR = function (options, access_token) {
        var verificationType = "IVR";
        this.setupVerificationV1(options, access_token, verificationType);
    };
    ;
    /**
     * @deprecated
     * setup backupcode - v1
     * @param options
     * @param access_token
     */
    WebAuth.prototype.setupBackupcode = function (options, access_token) {
        var verificationType = "BACKUPCODE";
        this.setupVerificationV1(options, access_token, verificationType);
    };
    ;
    /**
     * @deprecated
     * setup totp - v1
     * @param options
     * @param access_token
     */
    WebAuth.prototype.setupTOTP = function (options, access_token) {
        var verificationType = "TOTP";
        this.setupVerificationV1(options, access_token, verificationType);
    };
    ;
    /**
     * @deprecated
     * setup pattern - v1
     * @param options
     * @param access_token
     */
    WebAuth.prototype.setupPattern = function (options, access_token) {
        var verificationType = "PATTERN";
        this.setupVerificationV1(options, access_token, verificationType);
    };
    ;
    /**
     * @deprecated
     * setup touch - v1
     * @param options
     * @param access_token
     */
    WebAuth.prototype.setupTouchId = function (options, access_token) {
        var verificationType = "TOUCHID";
        this.setupVerificationV1(options, access_token, verificationType);
    };
    ;
    /**
     * @deprecated
     * setup smart push - v1
     * @param options
     * @param access_token
     */
    WebAuth.prototype.setupSmartPush = function (options, access_token) {
        var verificationType = "PUSH";
        this.setupVerificationV1(options, access_token, verificationType);
    };
    ;
    /**
     * @deprecated
     * setup face - v1
     * @param options
     * @param access_token
     */
    WebAuth.prototype.setupFace = function (options, access_token) {
        var verificationType = "FACE";
        this.setupVerificationV1(options, access_token, verificationType);
    };
    ;
    /**
     * @deprecated
     * setup voice - v1
     * @param options
     * @param access_token
     */
    WebAuth.prototype.setupVoice = function (options, access_token) {
        var verificationType = "VOICE";
        this.setupVerificationV1(options, access_token, verificationType);
    };
    ;
    /**
     * @deprecated
     * enroll verification - v1
     * @param options
     * @param access_token
     * @param verificationType
     * @returns
     */
    WebAuth.prototype.enrollVerificationV1 = function (options, access_token, verificationType) {
        return VerificationService_1.VerificationService.enrollVerificationV1(options, access_token, verificationType);
    };
    /**
     * @deprecated
     * enroll email - v1
     * @param options
     * @param access_token
     */
    WebAuth.prototype.enrollEmail = function (options, access_token) {
        var verificationType = "EMAIL";
        this.enrollVerificationV1(options, access_token, verificationType);
    };
    ;
    /**
     * @deprecated
     * enroll SMS - v1
     * @param options
     * @param access_token
     */
    WebAuth.prototype.enrollSMS = function (options, access_token) {
        var verificationType = "SMS";
        this.enrollVerificationV1(options, access_token, verificationType);
    };
    ;
    /**
     * @deprecated
     * enroll IVR - v1
     * @param options
     * @param access_token
     */
    WebAuth.prototype.enrollIVR = function (options, access_token) {
        var verificationType = "IVR";
        this.enrollVerificationV1(options, access_token, verificationType);
    };
    ;
    /**
     * @deprecated
     * enroll TOTP - v1
     * @param options
     * @param access_token
     */
    WebAuth.prototype.enrollTOTP = function (options, access_token) {
        var verificationType = "TOTP";
        this.enrollVerificationV1(options, access_token, verificationType);
    };
    ;
    /**
     * @deprecated
     * authenticate mfa - v1
     * @param verificationType
     * @returns
     */
    WebAuth.prototype.authenticateMfaV1 = function (options, verificationType) {
        return VerificationService_1.VerificationService.authenticateMfaV1(options, verificationType);
    };
    /**
     * @deprecated
     * authenticate email - v1
     * @param options
     */
    WebAuth.prototype.authenticateEmail = function (options) {
        var verificationType = "EMAIL";
        this.authenticateMfaV1(options, verificationType);
    };
    ;
    /**
     * @deprecated
     * authenticate sms - v1
     * @param options
     */
    WebAuth.prototype.authenticateSMS = function (options) {
        var verificationType = "SMS";
        this.authenticateMfaV1(options, verificationType);
    };
    ;
    /**
     * @deprecated
     * authenticate ivr - v1
     * @param options
     */
    WebAuth.prototype.authenticateIVR = function (options) {
        var verificationType = "IVR";
        this.authenticateMfaV1(options, verificationType);
    };
    ;
    /**
     * @deprecated
     * authenticate backupcode - v1
     * @param options
     */
    WebAuth.prototype.authenticateBackupcode = function (options) {
        var verificationType = "BACKUPCODE";
        this.authenticateMfaV1(options, verificationType);
    };
    ;
    /**
     * @deprecated
     * authenticate totp - v1
     * @param options
     */
    WebAuth.prototype.authenticateTOTP = function (options) {
        var verificationType = "TOTP";
        this.authenticateMfaV1(options, verificationType);
    };
    ;
    return WebAuth;
}());
exports.WebAuth = WebAuth;
