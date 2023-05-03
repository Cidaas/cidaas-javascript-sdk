"use strict";
exports.__esModule = true;
exports.LoginService = void 0;
var Helper_1 = require("./Helper");
var LoginService;
(function (LoginService) {
    /**
   * login with username and password
   * @param options
   */
    function loginWithCredentials(options) {
        try {
            var url = window.webAuthSettings.authority + "/login-srv/login";
            var form = Helper_1.Helper.createForm(url, options);
            document.body.appendChild(form);
            form.submit();
        }
        catch (ex) {
            throw new Helper_1.CustomException(ex, 417);
        }
    }
    LoginService.loginWithCredentials = loginWithCredentials;
    ;
    /**
   * login with username and password and return response
   * @param options
   * @returns
   */
    function loginWithCredentialsAsynFn(options) {
        try {
            var searchParams = new URLSearchParams(options);
            var response = fetch(window.webAuthSettings.authority + "/login-srv/login", {
                method: "POST",
                redirect: "follow",
                body: searchParams.toString(),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            return response;
        }
        catch (ex) {
            throw new Helper_1.CustomException(ex, 417);
        }
    }
    LoginService.loginWithCredentialsAsynFn = loginWithCredentialsAsynFn;
    ;
    /**
     * login with social
     * @param options
     * @param queryParams
     */
    function loginWithSocial(options, queryParams) {
        try {
            var _serviceURL = window.webAuthSettings.authority + "/login-srv/social/login/" + options.provider.toLowerCase() + "/" + options.requestId;
            if (queryParams && queryParams.dc && queryParams.device_fp) {
                _serviceURL = _serviceURL + "?dc=" + queryParams.dc + "&device_fp=" + queryParams.device_fp;
            }
            window.location.href = _serviceURL;
        }
        catch (ex) {
            console.log(ex);
        }
    }
    LoginService.loginWithSocial = loginWithSocial;
    ;
    /**
     * register with social
     * @param options
     * @param queryParams
     */
    function registerWithSocial(options, queryParams) {
        try {
            var _serviceURL = window.webAuthSettings.authority + "/login-srv/social/register/" + options.provider.toLowerCase() + "/" + options.requestId;
            if (queryParams && queryParams.dc && queryParams.device_fp) {
                _serviceURL = _serviceURL + "?dc=" + queryParams.dc + "&device_fp=" + queryParams.device_fp;
            }
            window.location.href = _serviceURL;
        }
        catch (ex) {
            console.log(ex);
        }
    }
    LoginService.registerWithSocial = registerWithSocial;
    ;
    /**
    * passwordless login
    * @param options
    */
    function passwordlessLogin(options) {
        try {
            var url = window.webAuthSettings.authority + "/login-srv/verification/login";
            var form = Helper_1.Helper.createForm(url, options);
            document.body.appendChild(form);
            form.submit();
        }
        catch (ex) {
            throw new Helper_1.CustomException(ex, 417);
        }
    }
    LoginService.passwordlessLogin = passwordlessLogin;
    ;
    /**
     * scope consent continue after token pre check
     * @param options
     */
    function scopeConsentContinue(options) {
        try {
            var form = document.createElement('form');
            form.action = window.webAuthSettings.authority + "/login-srv/precheck/continue/" + options.track_id;
            form.method = 'POST';
            document.body.appendChild(form);
            form.submit();
        }
        catch (ex) {
            throw new Helper_1.CustomException(ex, 417);
        }
    }
    LoginService.scopeConsentContinue = scopeConsentContinue;
    ;
    /**
     * claim consent continue login
     * @param options
     */
    function claimConsentContinue(options) {
        try {
            var form = document.createElement('form');
            form.action = window.webAuthSettings.authority + "/login-srv/precheck/continue/" + options.track_id;
            form.method = 'POST';
            document.body.appendChild(form);
            form.submit();
        }
        catch (ex) {
            throw new Helper_1.CustomException(ex, 417);
        }
    }
    LoginService.claimConsentContinue = claimConsentContinue;
    ;
    /**
    * consent continue login
    * @param options
    */
    function consentContinue(options) {
        try {
            var url = window.webAuthSettings.authority + "/login-srv/precheck/continue/" + options.track_id;
            var form = Helper_1.Helper.createForm(url, options);
            document.body.appendChild(form);
            form.submit();
        }
        catch (ex) {
            throw new Helper_1.CustomException(ex, 417);
        }
    }
    LoginService.consentContinue = consentContinue;
    ;
    /**
     * mfa continue login
     * @param options
     */
    function mfaContinue(options) {
        try {
            var url = window.webAuthSettings.authority + "/login-srv/precheck/continue/" + options.track_id;
            var form = Helper_1.Helper.createForm(url, options);
            document.body.appendChild(form);
            form.submit();
        }
        catch (ex) {
            throw new Helper_1.CustomException(ex, 417);
        }
    }
    LoginService.mfaContinue = mfaContinue;
    ;
    /**
     * change password continue
     * @param options
     */
    function firstTimeChangePassword(options) {
        try {
            var url = window.webAuthSettings.authority + "/login-srv/precheck/continue/" + options.loginSettingsId;
            ;
            var form = Helper_1.Helper.createForm(url, options);
            document.body.appendChild(form);
            form.submit();
        }
        catch (ex) {
            throw new Helper_1.CustomException(ex, 417);
        }
    }
    LoginService.firstTimeChangePassword = firstTimeChangePassword;
    ;
    /**
     * progressiveRegistration
     * @param options
     * @param headers
     * @returns
     */
    function progressiveRegistration(options, headers) {
        return new Promise(function (resolve, reject) {
            try {
                var http = new XMLHttpRequest();
                var _serviceURL = window.webAuthSettings.authority + "/login-srv/progressive/update/user";
                http.onreadystatechange = function () {
                    if (http.readyState == 4) {
                        if (http.responseText) {
                            resolve(JSON.parse(http.responseText));
                        }
                        else {
                            resolve(undefined);
                        }
                    }
                };
                http.open("POST", _serviceURL, true);
                http.setRequestHeader("Content-type", "application/json");
                http.setRequestHeader("requestId", headers.requestId);
                http.setRequestHeader("trackId", headers.trackId);
                if (headers.acceptlanguage) {
                    http.setRequestHeader("accept-language", headers.acceptlanguage);
                }
                else if (window.localeSettings) {
                    http.setRequestHeader("accept-language", window.localeSettings);
                }
                http.send(JSON.stringify(options));
            }
            catch (ex) {
                reject(ex);
            }
        });
    }
    LoginService.progressiveRegistration = progressiveRegistration;
    ;
    /**
     * loginAfterRegister
     * @param options
     */
    function loginAfterRegister(options) {
        try {
            var url = window.webAuthSettings.authority + "/login-srv/login/handle/afterregister/" + options.trackId;
            var form = Helper_1.Helper.createForm(url, options);
            document.body.appendChild(form);
            form.submit();
        }
        catch (ex) {
            throw new Helper_1.CustomException(ex, 417);
        }
    }
    LoginService.loginAfterRegister = loginAfterRegister;
    ;
})(LoginService = exports.LoginService || (exports.LoginService = {}));
