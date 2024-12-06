import {
    OidcManager,
    OidcSettings,
    LoginRedirectOptions,
    LogoutRedirectOptions,
    PopupSignInOptions,
    PopupSignOutOptions,
    RenewTokenOptions,
} from './Authentication.model';

export * from './Authentication.model';

export class Authentication {

    constructor(public webAuthSettings: OidcSettings, public userManager: OidcManager) { }

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
     * @param {string} view_type either 'login' or 'register'
     * @param {LoginRedirectOptions} options optional login options to override the webauth configuration
     */
    loginOrRegisterWithBrowser(view_type: string, options?: LoginRedirectOptions) {
        if (!this.webAuthSettings.extraQueryParams) {
            this.webAuthSettings.extraQueryParams = {};
        }
        this.webAuthSettings.extraQueryParams.view_type = view_type;
        if (this.webAuthSettings.response_type.indexOf("id_token") == -1 && this.webAuthSettings.scope?.indexOf("openid") != -1 && !this.webAuthSettings.extraQueryParams.nonce) {
            this.webAuthSettings.extraQueryParams.nonce = new Date().getTime().toString();
        }
        return this.userManager.signinRedirect({
            extraQueryParams: this.webAuthSettings.extraQueryParams,
            redirect_uri: this.webAuthSettings.redirect_uri,
            ...(options && { ...options } || {})
        });
    }

    /**
     * **popupSignIn()** will open the hosted login page in pop up window.
     * @example
     * ```js
     * cidaas.popupSignIn().then(function (response) {
     *   // the response will give you user details after finishing loginCallback().
     * }).catch(function(ex) {
     *  // your failure code here
     * });
     * ```
     * @param {PopupSignInOptions} options optional popup sign-in options to override webauth configurations
     */
    popupSignIn(options?: PopupSignInOptions) {
        return this.userManager.signinPopup(options);
    }

    /**
     * Once login successful, it will automatically redirects you to the redirect url whatever you mentioned in the options.
     * To complete the login process, call **loginCallback()**. This will parses the access_token, id_token and whatever in hash in the redirect url.
     * @example
     * ```js
     * cidaas.loginCallback().then(function (response: User) {
     *   // the response will give you login details.
     * }).catch(function(ex) {
     *  // your failure code here
     * });
     * ```
     * @param {string} url optional url to read sign in state from
     */
    loginCallback(url?: string) {
        return this.userManager.signinCallback(url);
    }

    /**
     * To use the **logout()** method, you need set the redirect url, if not it will automatically redirect to the login page
     * @example
     * ```js
     * cidaas.logout();
     * ```
     * @param {LogoutRedirectOptions} options optional logout options to override webauth configurations
     */
    logout(options?: LogoutRedirectOptions) {
        return this.userManager.signoutRedirect(options);
    }

    /**
     * **popupSignOut()** will open the hosted logout page in pop up window.
     * @example
     * ```js
     * cidaas.popupSignOut().then(function() {
     *   // success callback in main application window after finishing popupSignOutCallback().
     * }).catch(function(ex) {
     *   // your failure code here
     * });
     * ```
     *
     * @param {PopupSignOutOptions} options optional options to over-ride logout options using popup window
     */
    popupSignOut(options?: PopupSignOutOptions) {
        return this.userManager.signoutPopup(options);
    }

    /**
     * **logoutCallback()** will parses the details of userState after logout.
     * @example
     * ```js
     * cidaas.logoutCallback().then(function (response: LogoutResponse) {
     *   // the response will give you userState details.
     * }).catch(function(ex) {
     *  // your failure code here
     * });
     * ```
     * @param {string} url optional url to read signout state from,
     * @param {boolean} keepopen optional boolean to keep the popup window open after logout, in case of popupSignOut()
     */
    logoutCallback(url?: string, keepopen?: boolean) {
        return this.userManager.signoutCallback(url, keepopen);
    }

    /**
     * **renewToken()** will update user information in user storage with a new token, based on refresh token that is stored in the storage.
     * @example
     * ```js
     * cidaas.renewToken().then(function (response) {
     *   // the response will give you user details.
     * }).catch(function(ex) {
     *  // your failure code here
     * });
     * ```
     * @param {RenewTokenOptions} options options to over-ride the client config for renewing token
     */
    renewToken(options?: RenewTokenOptions) {
        return this.userManager.signinSilent({
            silentRequestTimeoutInSeconds: 60,
            ...( options && { ...options } || {})
        });
    }
}
