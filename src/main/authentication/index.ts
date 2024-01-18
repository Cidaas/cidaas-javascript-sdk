import { UserManager, UserManagerSettings } from "oidc-client-ts";

export class Authentication {

    constructor(public webAuthSettings: UserManagerSettings, public userManager: UserManager) { }

    /**
     * To login through cidaas sdk, call **loginWithBrowser()**. This will redirect you to the hosted login page.
     * once login successful, it will automatically redirects you to the redirect url whatever you mentioned in the options.
     * @example
     * ```js
     * cidaas.loginWithBrowser();
     * ```
     *
     * To register through cidaas sdk, call **registerWithBrowser()**. This will redirect you to the hosted registration page.
     * * @example
     * ```js
     * cidaas.registerWithBrowser();
     * ```
     *
     * @param view_type: either 'login' or 'register'
     */
    loginOrRegisterWithBrowser(view_type: string) {
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
            } else {
                throw "user manager is null";
            }
        } catch (ex) {
            console.log("user manager instance is empty : " + ex);
        }
    };

    /**
     * Once login successful, it will automatically redirects you to the redirect url whatever you mentioned in the options.
     * To complete the login process, call **loginCallback()**. This will parses the access_token, id_token and whatever in hash in the redirect url.
     * @example
     * ```js
     * cidaas.loginCallback().then(function (response) {
     *   // the response will give you login details.
     * }).catch(function(ex) {
     *  // your failure code here
     * });
     * ```
     */
    loginCallback() {
        return new Promise((resolve, reject) => {
            try {
                if (this.userManager) {
                    this.userManager.signinRedirectCallback()
                        .then(function (user: any) {
                            if (user) {
                                resolve(user);
                                return;
                            }
                            resolve(undefined);
                        }).catch(function (ex: any) {
                            reject(ex);
                        });
                } else {
                    throw "user manager is null";
                }
            } catch (ex) {
                reject(ex);
            }
        });
    }

    /**
     * To use the **logout()** method, you need set the redirect url, if not it will automatically redirect to the login page
     * @example
     * ```js
     * cidaas.logout().then(function () {
     *   // your logout success code here
     * }).catch(function(ex) {
     *  // your failure code here
     * });
     * ```
     */
    logout() {
        return new Promise((resolve, reject) => {
            try {
                if (this.userManager && this.webAuthSettings) {
                    this.userManager.signoutRedirect({
                        state: this.webAuthSettings
                    }).then(function (resp: any) {
                        console.log('signed out', resp);
                        window.authentication.logoutCallback().then(function (resp: any) {
                            resolve(resp);
                        }).catch(function (ex: any) {
                            reject(ex);
                        });
                    });
                } else {
                    throw "user manager or settings is null";
                }
            } catch (ex) {
                reject(ex);
            }
        });
    };

    /**
     * **logoutCallback()** will parses the details of userState after logout.
     * @example
     * ```js
     * cidaas.logoutCallback().then(function (response) {
     *   // the response will give you userState details.
     * }).catch(function(ex) {
     *  // your failure code here
     * });
     * ```
     */
    logoutCallback() {
        return new Promise((resolve, reject) => {
            try {
                if (this.userManager) {
                    this.userManager.signoutRedirectCallback().then(function (resp: any) {
                        console.log("Signed out");
                        resolve(resp);
                    }).catch(function (ex: any) {
                        reject(ex);
                    });
                } else {
                    resolve(undefined);
                    throw "user manager is null";
                }
            } catch (ex) {
                reject(ex);
            }
        });
    };

    /**
     * **popupSignIn()** will open the hosted login page in pop up window.
     * @example
     * ```js
     * cidaas.popupSignIn();
     * ```
     */
    popupSignIn() {
        try {
            if (this.userManager && this.webAuthSettings) {
                this.userManager.signinPopup().then(function () {
                    console.log("signed in");
                });
            } else {
                throw "user manager or settings is null";
            }
        } catch (ex) { console.error(ex) }
    };

    /**
     * To complete the popup login process, call **popupSignInCallback()** from the popup login window.
     * Popup window will be closed after doing callback
     * @example
     * ```js
     * cidaas.popupSignInCallback().then(function (response) {
     *   // the response will give you login details.
     * }).catch(function(ex) {
     *  // your failure code here
     * });
     * ```
     */
    popupSignInCallback() {
        try {
            if (this.userManager) {
                this.userManager.signinPopupCallback();
            }
        } catch (ex) { console.error(ex) }
    };

    /**
     * **popupSignOut()** will open the hosted logout page in pop up window.
     * @example
     * ```js
     * cidaas.popupSignOut()
     * ```
     */
    popupSignOut() {
        try {
            if (this.userManager && this.webAuthSettings) {
                this.userManager.signoutPopup({
                    state: this.webAuthSettings
                }).then(function (resp: any) {
                    console.log('signed out', resp);
                });
            } else {
                throw "user manager or settings is null";
            }
        } catch (ex) { console.error(ex) }

    };

    /**
     * calling **popupSignOutCallback()** from the popup window complete popup logout process.
     * Popup window won't be closed after doing callback
     * @example
     * ```js
     * cidaas.popupSignOutCallback();
     * ```
     */
    popupSignOutCallback() {
        try {
            if (this.userManager) {
                this.userManager.signoutPopupCallback(this.webAuthSettings.post_logout_redirect_uri, true);
            } else {
                throw "user manager is null";
            }
        } catch (ex) { console.error(ex) }
    };

    /**
     * **silentSignIn()** will open the hosted login page in an iframe.
     * this function could only be called from the same domain. Cross Domain is not supported for security purpose.
     * @example
     * ```js
     * cidaas.silentSignIn().then(function (response) {
     *   // the response will give you user details.
     * }).catch(function(ex) {
     *  // your failure code here
     * });
     * ```
     */
    silentSignIn() {
        return new Promise((resolve, reject) => {
            try {
                if (this.userManager && this.webAuthSettings) {

                    this.userManager.signinSilent({
                        state: this.webAuthSettings,
                        silentRequestTimeoutInSeconds: 60
                    }).then(function (user: any) {
                        if (user) {
                            resolve(user);
                            return;
                        }
                        resolve(undefined);
                    }).catch(function (ex: any) {
                        reject(ex);
                    });
                } else {
                    throw "user manager or web auth settings is null";
                }
            } catch (ex) {
                reject(ex);
            }
        });
    };

    /**
     * To complete the silent login process, call **silentSignInCallback()** from the iframe. This will complete the login process in iframe.
     * @example
     * ```js
     * cidaas.silentSignInCallback();
     * ```
     */
    silentSignInCallback(callbackurl?: string) {
        return new Promise((resolve, reject) => {
            try {
                if (this.userManager) {
                    this.userManager.signinSilentCallback(callbackurl)
                        .then(function (user: any) {
                            if (user) {
                                resolve(user);
                                return;
                            }
                            resolve(undefined);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                } else {
                    throw "user manager is null";
                }
            } catch (ex) {
                reject(ex);
            }
        });

    };
}
