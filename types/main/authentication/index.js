"use strict";
exports.__esModule = true;
exports.Authentication = void 0;
var Authentication = /** @class */ (function () {
    function Authentication(webAuthSettings, userManager) {
        this.webAuthSettings = webAuthSettings;
        this.userManager = userManager;
    }
    /**
     * redirect sign in
     * @param view_type
     */
    Authentication.prototype.redirectSignIn = function (view_type) {
        try {
            if (this.userManager) {
                if (this.webAuthSettings) {
                    if (!this.webAuthSettings.extraQueryParams) {
                        this.webAuthSettings.extraQueryParams = {};
                    }
                    this.webAuthSettings.extraQueryParams.view_type = view_type;
                    if (this.webAuthSettings.scope) {
                        if (this.webAuthSettings.response_type.indexOf("id_token") == -1 && this.webAuthSettings.scope.indexOf("openid") != -1 && !this.webAuthSettings.extraQueryParams.nonce) {
                            this.webAuthSettings.extraQueryParams.nonce = new Date().getTime().toString();
                        }
                    }
                }
                this.userManager.signinRedirect({
                    extraQueryParams: this.webAuthSettings.extraQueryParams,
                    redirect_uri: this.webAuthSettings.redirect_uri
                }).then(function () {
                    console.log("Redirect logged in using cidaas sdk");
                });
            }
            else {
                throw "user manager is null";
            }
        }
        catch (ex) {
            console.log("user manager instance is empty : " + ex);
        }
    };
    ;
    /**
     * redirect sign in callback
     * @returns
     */
    Authentication.prototype.redirectSignInCallback = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (_this.userManager) {
                    _this.userManager.signinRedirectCallback()
                        .then(function (user) {
                        if (user) {
                            resolve(user);
                            return;
                        }
                        resolve(undefined);
                    });
                }
                else {
                    throw "user manager is null";
                }
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    /**
     * redirect sign out
     * @returns
     */
    Authentication.prototype.redirectSignOut = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (_this.userManager && _this.webAuthSettings) {
                    _this.userManager.signoutRedirect({
                        state: _this.webAuthSettings
                    }).then(function (resp) {
                        console.log('signed out', resp);
                        window.authentication.redirectSignOutCallback().then(function (resp) {
                            resolve(resp);
                        });
                    });
                }
                else {
                    throw "user manager or settings is null";
                }
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ;
    /**
     * redirect sign out callback
     * @returns
     */
    Authentication.prototype.redirectSignOutCallback = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (_this.userManager) {
                    _this.userManager.signoutRedirectCallback().then(function (resp) {
                        console.log("Signed out");
                        resolve(resp);
                    });
                }
                else {
                    resolve(undefined);
                    throw "user manager is null";
                }
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ;
    /**
     * pop up sign in
     */
    Authentication.prototype.popupSignIn = function () {
        try {
            if (this.userManager && this.webAuthSettings) {
                this.userManager.signinPopup().then(function () {
                    console.log("signed in");
                });
            }
            else {
                throw "user manager or settings is null";
            }
        }
        catch (ex) {
            console.error(ex);
        }
    };
    ;
    /**
     * pop up sign in callback
     */
    Authentication.prototype.popupSignInCallback = function () {
        try {
            if (this.userManager) {
                this.userManager.signinPopupCallback();
            }
        }
        catch (ex) {
            console.error(ex);
        }
    };
    ;
    /**
     * pop up sign out
     */
    Authentication.prototype.popupSignOut = function () {
        try {
            if (this.userManager && this.webAuthSettings) {
                this.userManager.signoutPopup({
                    state: this.webAuthSettings
                }).then(function (resp) {
                    console.log('signed out', resp);
                });
            }
            else {
                throw "user manager or settings is null";
            }
        }
        catch (ex) {
            console.error(ex);
        }
    };
    ;
    /**
     * silent sign in
     */
    Authentication.prototype.silentSignIn = function () {
        try {
            if (this.userManager && this.webAuthSettings) {
                this.userManager.signinSilent({
                    state: this.webAuthSettings
                }).then(function (user) {
                    console.log("signed in : " + user.access_token);
                });
            }
            else {
                throw "user manager is null";
            }
        }
        catch (ex) {
            console.error(ex);
        }
    };
    ;
    /**
     * silent sign in callback
     */
    Authentication.prototype.silentSignInCallback = function () {
        try {
            if (this.userManager) {
                this.userManager.signinSilentCallback();
            }
            else {
                throw "user manager is null";
            }
        }
        catch (ex) {
            console.error(ex);
        }
    };
    ;
    /**
     * silent sign in callback v2
     * @returns
     */
    Authentication.prototype.silentSignInCallbackV2 = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (_this.userManager) {
                    _this.userManager.signinSilentCallback(_this.webAuthSettings.silent_redirect_uri)
                        .then(function (user) {
                        if (user) {
                            resolve(user);
                            return;
                        }
                        resolve(undefined);
                    });
                }
                else {
                    throw "user manager is null";
                }
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ;
    /**
     * silent sign out callback
     */
    Authentication.prototype.popupSignOutCallback = function () {
        try {
            if (this.userManager) {
                this.userManager.signoutPopupCallback(this.webAuthSettings.post_logout_redirect_uri, true);
            }
            else {
                throw "user manager is null";
            }
        }
        catch (ex) {
            console.error(ex);
        }
    };
    ;
    return Authentication;
}());
exports.Authentication = Authentication;
