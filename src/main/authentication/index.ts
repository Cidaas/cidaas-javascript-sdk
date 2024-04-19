import {
    OidcManager,
    OidcSettings,
    LoginRedirectOptions,
    LogoutRedirectOptions,
    PopupSignInOptions,
    PopupSignOutOptions,
    SilentSignInOptions, LogoutResponse,
} from './authentication.model';

export * from './authentication.model';

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
     * @param {string} url optional url to read sign in state from
     */
    loginCallback(url?: string) {
        return this.userManager.signinRedirectCallback(url);
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
     * **logoutCallback()** will parses the details of userState after logout.
     * @example
     * ```js
     * cidaas.logoutCallback().then(function (response) {
     *   // the response will give you userState details.
     * }).catch(function(ex) {
     *  // your failure code here
     * });
     * ```
     * @param {string} url optional url to read signout state from,
     */
    logoutCallback(url?: string): Promise<LogoutResponse> {
        return this.userManager.signoutRedirectCallback(url);
    }

    /**
     * **popupSignIn()** will open the hosted login page in pop up window.
     * @example
     * ```js
     * cidaas.popupSignIn().then(function (response) {
     *   // the response will give you user details after finishing popupSignInCallback().
     * }).catch(function(ex) {
     *  // your failure code here
     * });
     * ```
     * @param {LogoutRedirectOptions} options optional popup sign-in options to override webauth configurations
     */
    popupSignIn(options?: PopupSignInOptions) {
        return this.userManager.signinPopup(options);
    }

    /**
     * To complete the popup login process, call **popupSignInCallback()** from the popup login window. 
     * Popup window will be closed after doing callback
     * @example
     * ```js
     * cidaas.popupSignInCallback();
     * ```
     * @param {string} url optional url to read sign-in callback state from
     * @param {boolean} keepOpen true to keep the popup open even after sign in, else false
     */
    popupSignInCallback(url?: string, keepOpen?: boolean) {
        return this.userManager.signinPopupCallback(url, keepOpen);
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
     * calling **popupSignOutCallback()** from the popup window complete popup logout process. 
     * Popup window won't be closed after doing callback
     * @example
     * ```js
     * cidaas.popupSignOutCallback().then(function() {
     *   // success callback in popup window after finishing popupSignOutCallback().
     * }).catch(function(ex) {
     *   // your failure code here
     * });
     * ```
     *
     * @param {string} url optional url to override to check for sign out state
     * @param {boolean} keepOpen true to keep the popup open even after sign out, else false
     */
    popupSignOutCallback(url?: string, keepOpen: boolean = true) {
        url = url ?? this.webAuthSettings.post_logout_redirect_uri;
        return this.userManager.signoutPopupCallback(url, keepOpen);
    }

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
     * @param {SilentSignInOptions} options options to over-ride the client config for silent sign in
     */
    silentSignIn(options?: SilentSignInOptions) {
        return this.userManager.signinSilent({
            silentRequestTimeoutInSeconds: 60,
            ...( options && { ...options } || {})
        });
    }

    /**
     * To complete the silent login process, call **silentSignInCallback()** from the iframe. This will complete the login process in iframe.
     * @example
     * ```js
     * cidaas.silentSignInCallback();
     *
     * ```
     * @param {string} url optional url to read sign in state from
     */
    silentSignInCallback(url?: string) {
        return this.userManager.signinSilentCallback(url);
    }
}
