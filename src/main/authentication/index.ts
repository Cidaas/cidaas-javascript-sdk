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
        if (!this.webAuthSettings.extraQueryParams) {
            this.webAuthSettings.extraQueryParams = {};
        }
        this.webAuthSettings.extraQueryParams.view_type = view_type;
        if (this.webAuthSettings.response_type.indexOf("id_token") == -1 && this.webAuthSettings.scope?.indexOf("openid") != -1 && !this.webAuthSettings.extraQueryParams.nonce) {
            this.webAuthSettings.extraQueryParams.nonce = new Date().getTime().toString();
        }
        return this.userManager.signinRedirect({
            extraQueryParams: this.webAuthSettings.extraQueryParams,
            redirect_uri: this.webAuthSettings.redirect_uri
        });
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
        return this.userManager.signinRedirectCallback();
    }

    /**
     * To use the **logout()** method, you need set the redirect url, if not it will automatically redirect to the login page
     * @example
     * ```js
     * cidaas.logout();
     * ```
     */
    logout() {
        return this.userManager.signoutRedirect({ state: this.webAuthSettings });
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
     */
    logoutCallback() {
        return this.userManager.signoutRedirectCallback();
    };

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
     */
    popupSignIn() {
        return this.userManager.signinPopup();
    };

    /**
     * To complete the popup login process, call **popupSignInCallback()** from the popup login window. 
     * Popup window will be closed after doing callback
     * @example
     * ```js
     * cidaas.popupSignInCallback();
     * ```
     */
    popupSignInCallback() {
        return this.userManager.signinPopupCallback();
    };

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
     */
    popupSignOut() {
        return this.userManager.signoutPopup({ state: this.webAuthSettings });
    };

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
     */
    popupSignOutCallback() {
        return this.userManager.signoutPopupCallback(this.webAuthSettings.post_logout_redirect_uri, true);
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
        return this.userManager.signinSilent({
            state: this.webAuthSettings,
            silentRequestTimeoutInSeconds: 60
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
        return this.userManager.signinSilentCallback(callbackurl);
    };
}
