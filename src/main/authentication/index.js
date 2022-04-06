// authentication class
function Authentication() {

}

// redirect sign in
Authentication.prototype.redirectSignIn = function(view_type) {
    try {
        if (window.usermanager) {

            if (window.webAuthSettings) {
                if (!window.webAuthSettings.extraQueryParams) {
                    window.webAuthSettings.extraQueryParams = {};
                }
                window.webAuthSettings.extraQueryParams.view_type = view_type;
                if (window.webAuthSettings.scope) {
                    if (window.webAuthSettings.response_type.indexOf("id_token") == -1 && window.webAuthSettings.scope.indexOf("openid") != -1 && !window.webAuthSettings.extraQueryParams.nonce) {
                        window.webAuthSettings.extraQueryParams.nonce = new Date().getTime().toString();
                    }
                }
            } else {
                window.webAuthSettings = {};
            }
            window.usermanager.signinRedirect({
                extraQueryParams: window.webAuthSettings.extraQueryParams,
                data: window.webAuthSettings
            }).then(function() {
                console.log("Redirect logged in using cidaas sdk");
            });
        } else {
            throw "user manager is nil";
        }
    } catch (ex) {
        console.log("user manager instance is empty : " + ex);
    }
};

// redirect sign in callback
Authentication.prototype.redirectSignInCallback = function() {
    return new Promise(function(resolve, reject) {
        try {
            if (window.usermanager) {
                window.usermanager.signinRedirectCallback({
                    data: window.webAuthSettings
                }).then(function(user) {
                    if (user) {
                        resolve(user);
                        return;
                    }
                    resolve(undefined);
                });
            } else {
                throw "user manager is nil";
            }
        } catch (ex) {
            reject(ex);
        }
    });
};

// redirect sign out
Authentication.prototype.redirectSignOut = function() {
    return new Promise(function(resolve, reject) {
        try {
            if (window.usermanager && window.webAuthSettings) {
                window.usermanager.signoutRedirect({
                    state: window.webAuthSettings
                }).then(function(resp) {
                    console.log('signed out', resp);
                    window.authentication.redirectSignOutCallback().then(function(resp) {
                        resolve(resp);
                    });
                });
            } else {
                throw "user manager or settings is nil";
            }
        } catch (ex) {
            reject(ex);
        }
    });
};

// redirect sign out callback
Authentication.prototype.redirectSignOutCallback = function() {
    return new Promise(function(resolve, reject) {
        try {
            if (window.usermanager) {
                window.usermanager.signoutRedirectCallback().then(function(resp) {
                    console.log("Signed out");
                    resolve(resp);
                });
            } else {
                resolve(undefined);
                throw "user manager is nil";
            }
        } catch (ex) {}
    });
};

// pop up sign in
Authentication.prototype.popupSignIn = function() {
    try {
        if (window.usermanager && window.webAuthSettings) {
            window.usermanager.signinPopup({
                data: window.webAuthSettings
            }).then(function() {
                console.log("signed in");
                // window.location = "/";
            });
        } else {
            throw "user manager or settings is nil";
        }
    } catch (ex) {}
};

// pop up sign in callback
Authentication.prototype.popupSignInCallback = function() {
    try {
        if (window.usermanager) {
            window.usermanager.signinPopupCallback();
        }
    } catch (ex) {}
};

// pop up sign out
Authentication.prototype.popupSignOut = function() {
    try {
        if (window.usermanager && window.webAuthSettings) {
            window.usermanager.signoutPopup({
                state: window.webAuthSettings
            }).then(function(resp) {
                console.log('signed out', resp);
            });
        } else {
            throw "user manager or settings is nil";
        }
    } catch (ex) {}

};

// pop up sign out callback
Authentication.prototype.popupSignOutCallback = function() {
    try {
        if (window.usermanager) {
            window.usermanager.signoutPopupCallback(true);
        } else {
            throw "user manager is nil";
        }
    } catch (ex) {}
};

// silent sign in
Authentication.prototype.silentSignIn = function() {
    try {
        if (window.usermanager && window.webAuthSettings) {
            window.usermanager.signinSilent({
                state: window.webAuthSettings
            }).then(function(user) {
                console.log("signed in : " + user.access_token);
            });
        } else {
            throw "user manager is nil";
        }
    } catch (ex) {}
};

// silent sign in callback
Authentication.prototype.silentSignInCallback = function() {
    try {
        if (window.usermanager) {
            window.usermanager.signinSilentCallback();
        } else {
            throw "user manager is nil";
        }
    } catch (ex) {}
};

// silent sign in callback v2
Authentication.prototype.silentSignInCallbackV2 = function() {
    return new Promise(function(resolve, reject) {
        try {
            if (window.usermanager) {
                window.usermanager.signinSilentCallback({
                    data: window.webAuthSettings
                }).then(function(user) {
                    if (user) {
                        resolve(user);
                        return;
                    }
                    resolve(undefined);
                });
            } else {
                throw "user manager is nil";
            }
        } catch (ex) {
            reject(ex);
        }
    });

};

// silent sign out callback
Authentication.prototype.popupSignOutCallback = function() {
    try {
        if (window.usermanager) {
            window.usermanager.signoutPopupCallback(true);
        } else {
            throw "user manager is nil";
        }
    } catch (ex) {}
};

module.exports = Authentication;