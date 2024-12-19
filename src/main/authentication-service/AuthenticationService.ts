import ConfigUserProvider from '../common/ConfigUserProvider';
import { CustomException } from '../common/Helper';
import {
	OidcManager,
	OidcSettings,
	LoginRedirectOptions,
	LogoutRedirectOptions,
	PopupSignInOptions,
	PopupSignOutOptions,
	RenewTokenOptions,
	User,
	LogoutResponse,
	LoginRequestOptions,
} from './AuthenticationService.model';

export class AuthenticationService {
	userManager: OidcManager;
	config: OidcSettings;
	configUserProvider: ConfigUserProvider;

	constructor(configUserProvider: ConfigUserProvider) {
		if (!configUserProvider || !configUserProvider.getConfig()) {
			throw new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
		}
		this.config = configUserProvider.getConfig();
		this.userManager = configUserProvider.getUserManager();
		this.userManager.events.addSilentRenewError(function () {
			throw new CustomException("Error while renewing silent login", 500);
		});
		this.configUserProvider = configUserProvider;
	}

	/**
	 * To register through cidaas sdk, call **registerWithBrowser()**. This will generate and redirect the app to authz url in same window for register view. 
	 * Afterwards you will be redirected to the hosted registration page.
	 * @example
	 * ```js
	 * cidaasAuthenticationService.registerWithBrowser();
	 * ```
	 * @param {LoginRedirectOptions} options to over-ride the client config for redirect login
	 */
	registerWithBrowser(options?: LoginRedirectOptions): Promise<void> {
		return loginOrRegisterWithBrowser(this.configUserProvider, 'register', options);
	}

	/**
	 * To login through cidaas sdk, call **loginWithBrowser()**. This will generate and redirect the app to authz url in same window for logging in. Afterwards you will be redirected to the hosted login page.
	 * Once login successful, it will automatically redirects you to the redirect url, which is configured in cidaas config.
	 * @example
	 * ```js
	 * cidaasAuthenticationService.loginWithBrowser();
	 * ```
	 * @param {LoginRedirectOptions} options to over-ride the client config for redirect login
	 */
	loginWithBrowser(options?: LoginRedirectOptions): Promise<void> {
		return loginOrRegisterWithBrowser(this.configUserProvider, 'login', options);
	}

	/**
	 * To open the hosted login page in pop up window, call **popupSignIn()**. This will generate and open authz url in a popup window.
	 * On successful sign in, authenticated user is returned.
	 * @example
	 * ```js
	 * cidaasAuthenticationService.popupSignIn().then(function (response) {
	 *   // the response will give you user details after finishing loginCallback().
	 * }).catch(function(ex) {
	 *  // your failure code here
	 * });
	 * ```
	 * @param {PopupSignInOptions} options optional options to over-ride the client config for popup sign in
	 */
	popupSignIn(options?: PopupSignInOptions): Promise<User> {
		return this.userManager.signinPopup(options);
	}

	/**
	 * Once login successful, it will automatically redirects you to the redirect url, which is configured in cidaas config.
	 * To complete the login process, call **loginCallback()**. This will parses needed informations such as tokens in the redirect url.
	 * 
	 * @example
	 * ```js
	 * cidaasAuthenticationService.loginCallback().then(function (response: User) {
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
	 * To end user session, call **logout()**. You need set the redirect url, if not it will automatically redirect to the login page
	 * @example
	 * ```js
	 * cidaasAuthenticationService.logout();
	 * ```
	 * @param {LogoutRedirectOptions} options optional logout options to override cidaas configuration
	 */
	logout(options?: LogoutRedirectOptions) {
		return this.userManager.signoutRedirect(options);
	}

	/**
	 * To open the hosted logout page in pop up window, call **popupSignOut()**.
	 * @example
	 * ```js
	 * cidaasAuthenticationService.popupSignOut().then(function() {
	 *   // success callback in main application window after finishing popupSignOutCallback().
	 * }).catch(function(ex) {
	 *   // your failure code here
	 * });
	 * ```
	 *
	 * @param {PopupSignOutOptions} options optional logout options to override cidaas configuration
	 */
	popupSignOut(options?: PopupSignOutOptions) {
		return this.userManager.signoutPopup(options);
	}

	/**
	 * **logoutCallback()** will parses the details of userState after logout. 
	 * Get the logout call state from the url provided, if none is provided current window url is used.
	 * @example
	 * ```js
	 * cidaasAuthenticationService.logoutCallback().then(function (response: LogoutResponse) {
	 *   // the response will give you userState details.
	 * }).catch(function(ex) {
	 *  // your failure code here
	 * });
	 * ```
	 * @param {string} url optional url to read signout state from,
	 * @param {boolean} keepopen optional boolean to keep the popup window open after logout, in case of popupSignOut()
	 */
	logoutCallback(url?: string, keepopen?: boolean): Promise<LogoutResponse | undefined> {
		return this.userManager.signoutCallback(url, keepopen);
	}

	/**
	 * **renewToken()** will update user information in user storage with a new token, based on refresh token that is stored in the storage.
	 * On successful token renewal, authenticated user is returned
	 * 
	 * @example
	 * ```js
	 * cidaasAuthenticationService.renewToken().then(function (response) {
	 *   // the response will give you user details.
	 * }).catch(function(ex) {
	 *  // your failure code here
	 * });
	 * ```
	 * @param {RenewTokenOptions} options options to over-ride the client config for renewing token.
	 * @returns {Promise<User>} Authenticated user
	 */
	renewToken(options?: RenewTokenOptions): Promise<User> {
		return this.userManager.signinSilent({
			silentRequestTimeoutInSeconds: 60,
			...(options && { ...options } || {})
		});
	}

	/**
	 * To get the generated login url, call **getLoginURL()**. This will call authz service and generate login url to be used.
	 * @example
	 * ```js
	 * cidaasAuthenticationService.getLoginURL().then(function (response) {
	 *   // the response will give you login url.
	 * }).catch(function(ex) {
	 *   // your failure code here
	 * });
	 * ```
	 * @param {LoginRequestOptions} options login options to override config settings provided
	 * @return {Promise<string>} authz url for login
	 */
	getLoginURL(options?: LoginRequestOptions): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.userManager.getClient().createSigninRequest({
				...this.config,
				...(options && { options } || {})
			}).then((signinRequest: { url: string }) => {
				resolve(signinRequest.url);
			}).catch((e: any) => {
				reject(e);
			});
		});
	}

	/**
	 * To get the user informations from defined UserStorage, call **getUserInfoFromStorage()**. 
	 * This will fetch informations about the authenticated user such as tokens & user profiles, which has been stored in predefined user storage based on cidaas configuration. (default is session storage)
	 * 
	 * @example
	 * ```js
	 * cidaasAuthenticationService.getUserInfoFromStorage().then(function (response) {
	 *   // the response will give you profile details.
	 * }).catch(function(ex) {
	 *   // your failure code here
	 * });
	 * ```
	 * @return {Promise<User|null>} returns authenticated user if present, else null
	 */
	async getUserInfoFromStorage(): Promise<User | null> {
		if (!this.userManager) {
			return Promise.reject(new CustomException("UserManager cannot be empty", 417));
		}
		return await this.userManager.getUser();
	}
}

/**
 * This function will be called internally by loginWithBrowser() & registerWithBrowser function, to either authenticate existing user or register a new one.
 * 
 * @param {ConfigUserProvider} configUserProvider contains cidaas configuration and user manager
 * @param {string} view_type either 'login' or 'register'
 * @param {LoginRedirectOptions} options optional login options to override the webauth configuration
 */
function loginOrRegisterWithBrowser(configUserProvider: ConfigUserProvider, view_type: string, options?: LoginRedirectOptions): Promise<void> {
	const config = configUserProvider.getConfig();
	if (!config.extraQueryParams) {
		config.extraQueryParams = {};
	}
	config.extraQueryParams.view_type = view_type;
	if (config.response_type.indexOf("id_token") == -1 && config.scope?.indexOf("openid") != -1 && !config.extraQueryParams.nonce) {
		config.extraQueryParams.nonce = new Date().getTime().toString();
	}
	const userManager = configUserProvider.getUserManager();
	return userManager.signinRedirect({
		extraQueryParams: config.extraQueryParams,
		redirect_uri: config.redirect_uri,
		...(options && { ...options } || {})
	});
}
