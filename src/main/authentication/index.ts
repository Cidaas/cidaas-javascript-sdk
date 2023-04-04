import { UserManager, UserManagerSettings } from "oidc-client-ts";
declare var window: any;

export class Authentication {

    constructor(public webAuthSettings: UserManagerSettings, public userManager: UserManager) { }

    /**
     * redirect sign in
     * @param view_type 
     */
    redirectSignIn(view_type: string) {
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
     * redirect sign in callback
     * @returns 
     */
    redirectSignInCallback() {
        return new Promise((resolve, reject) => {
            try {
                if (this.userManager) {
                    this.userManager.signinRedirectCallback(this.webAuthSettings.redirect_uri)
                        .then(function (user: any) {
                            if (user) {
                                resolve(user);
                                return;
                            }
                            resolve(undefined);
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
     * redirect sign out
     * @returns 
     */
    redirectSignOut() {
        return new Promise((resolve, reject) => {
            try {
                if (this.userManager && this.webAuthSettings) {
                    this.userManager.signoutRedirect({
                        state: this.webAuthSettings
                    }).then(function (resp: any) {
                        console.log('signed out', resp);
                        window.authentication.redirectSignOutCallback().then(function (resp: any) {
                            resolve(resp);
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
     * redirect sign out callback
     * @returns 
     */
    redirectSignOutCallback() {
        return new Promise((resolve, reject) => {
            try {
                if (this.userManager) {
                    this.userManager.signoutRedirectCallback().then(function (resp: any) {
                        console.log("Signed out");
                        resolve(resp);
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
     * pop up sign in
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
     * pop up sign in callback
     */
    popupSignInCallback() {
        try {
            if (this.userManager) {
                this.userManager.signinPopupCallback();
            }
        } catch (ex) { console.error(ex) }
    };

    /**
     * pop up sign out
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
     * silent sign in
     */
    silentSignIn() {
        try {
            if (this.userManager && this.webAuthSettings) {
                this.userManager.signinSilent({
                    state: this.webAuthSettings
                }).then(function (user: any) {
                    console.log("signed in : " + user.access_token);
                });
            } else {
                throw "user manager is null";
            }
        } catch (ex) { console.error(ex) }
    };

    /**
     * silent sign in callback
     */
    silentSignInCallback() {
        try {
            if (this.userManager) {
                this.userManager.signinSilentCallback();
            } else {
                throw "user manager is null";
            }
        } catch (ex) { console.error(ex) }
    };

    /**
     * silent sign in callback v2
     * @returns 
     */
    silentSignInCallbackV2() {
        return new Promise((resolve, reject) => {
            try {
                if (this.userManager) {
                    this.userManager.signinSilentCallback(this.webAuthSettings.silent_redirect_uri)
                        .then(function (user: any) {
                            if (user) {
                                resolve(user);
                                return;
                            }
                            resolve(undefined);
                        });
                } else {
                    throw "user manager is null";
                }
            } catch (ex) {
                reject(ex);
            }
        });

    };

    /**
     * silent sign out callback
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
}
