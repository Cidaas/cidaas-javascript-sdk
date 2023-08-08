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
exports.TokenService = void 0;
var Helper_1 = require("./Helper");
var TokenService;
(function (TokenService) {
    /**
     * renew token using refresh token
     * @param options
     * @returns
     */
    function renewToken(options) {
        if (!options.refresh_token) {
            throw new Helper_1.CustomException("refresh_token cannot be empty", 417);
        }
        options.client_id = window.webAuthSettings.client_id;
        options.grant_type = 'refresh_token';
        var _serviceURL = window.webAuthSettings.authority + "/token-srv/token";
        return Helper_1.Helper.createPostPromise(options, _serviceURL, undefined, "POST");
    }
    TokenService.renewToken = renewToken;
    ;
    /**
     * get access token from code
     * @param options
     * @returns
     */
    function getAccessToken(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var signInRequest, _serviceURL;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!options.code) {
                            throw new Helper_1.CustomException("code cannot be empty", 417);
                        }
                        options.client_id = window.webAuthSettings.client_id;
                        options.redirect_uri = window.webAuthSettings.redirect_uri;
                        options.grant_type = "authorization_code";
                        if (!!window.webAuthSettings.disablePKCE) return [3 /*break*/, 2];
                        return [4 /*yield*/, window.usermanager._client.createSigninRequest(window.webAuthSettings)];
                    case 1:
                        signInRequest = _b.sent();
                        options.code_verifier = (_a = signInRequest.state) === null || _a === void 0 ? void 0 : _a.code_verifier;
                        _b.label = 2;
                    case 2:
                        _serviceURL = window.webAuthSettings.authority + "/token-srv/token";
                        return [2 /*return*/, Helper_1.Helper.createPostPromise(options, _serviceURL, undefined, "POST")];
                }
            });
        });
    }
    TokenService.getAccessToken = getAccessToken;
    ;
    /**
     * validate access token
     * @param options
     * @returns
     */
    function validateAccessToken(options) {
        if (!options.token || !options.token_type_hint) {
            throw new Helper_1.CustomException("token or token_type_hint cannot be empty", 417);
        }
        var _serviceURL = window.webAuthSettings.authority + "/token-srv/introspect";
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, "POST");
    }
    TokenService.validateAccessToken = validateAccessToken;
    ;
    /**
     * get scope consent details
     * @param options
     * @returns
     */
    function getScopeConsentDetails(options) {
        var _serviceURL = window.webAuthSettings.authority + "/token-srv/prelogin/metadata/" + options.track_id + "?acceptLanguage=" + options.locale;
        return Helper_1.Helper.createPostPromise(undefined, _serviceURL, false, "GET");
    }
    TokenService.getScopeConsentDetails = getScopeConsentDetails;
    ;
    /**
     * updateSuggestMFA
     * @param track_id
     * @param options
     * @returns
     */
    function updateSuggestMFA(track_id, options) {
        var _serviceURL = window.webAuthSettings.authority + "/token-srv/prelogin/suggested/mfa/update/" + track_id;
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, "POST");
    }
    TokenService.updateSuggestMFA = updateSuggestMFA;
    ;
    /**
     * getMissingFieldsLogin
     * @param trackId
     * @returns
     */
    function getMissingFieldsLogin(trackId) {
        var _serviceURL = window.webAuthSettings.authority + "/token-srv/prelogin/metadata/" + trackId;
        return Helper_1.Helper.createPostPromise(undefined, _serviceURL, false, "GET");
    }
    TokenService.getMissingFieldsLogin = getMissingFieldsLogin;
    ;
    /**
     * device code flow - verify
     * @param code
     */
    function deviceCodeVerify(code) {
        var params = "user_code=".concat(encodeURI(code));
        var url = "".concat(window.webAuthSettings.authority, "/token-srv/device/verify?").concat(params);
        try {
            var options = {
                user_code: encodeURI(code)
            };
            var form = Helper_1.Helper.createForm(url, options, 'GET');
            document.body.appendChild(form);
            form.submit();
        }
        catch (ex) {
            throw new Error(ex);
        }
    }
    TokenService.deviceCodeVerify = deviceCodeVerify;
})(TokenService = exports.TokenService || (exports.TokenService = {}));
