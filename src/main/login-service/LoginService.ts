import { Helper, CustomException } from "../common/Helper";
import { LoginPrecheckRequest } from "../common/Common.model";
import { FirstTimeChangePasswordRequest, LoginAfterRegisterRequest, LoginWithCredentialsRequest, PasswordlessLoginRequest, ProgressiveRegistrationHeader, SocialProviderPathParameter, SocialProviderQueryParameter } from "./LoginService.model";
import { CidaasUser } from "../common/User.model";
import { OidcSettings } from "../authentication-service/AuthenticationService.model";
import ConfigUserProvider from "../common/ConfigUserProvider";

export class LoginService {
	private config: OidcSettings;

	constructor(configUserProvider: ConfigUserProvider) {
		this.config = configUserProvider.getConfig();
	}

	/**
	 * To login with your credentials, call **loginWithCredentials()**. After successful login, this will redirect you to the redirect_url that you mentioned earlier while initialising the sdk.
	 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/5gphdk6vapp56-classic-login#call-login-api for more details.
	 * @example
	 * ```js
	 * cidaasLoginService.loginWithCredentials({
	 *   username: 'xxxx@gmail.com',
	 *   username_type: 'email',
	 *   password: '123456',
	 *   requestId: 'your requestId',
	 * });
	 * ```
	 */
	loginWithCredentials(options: LoginWithCredentialsRequest) {
		try {
			const url = this.config.authority + "/login-srv/login";
			const form = Helper.createForm(url, options)
			document.body.appendChild(form);
			form.submit();
		} catch (ex) {
			throw new CustomException(String(ex), 417);
		}
	}

	/**
	 * To login with social providers, call **loginWithSocial()**. This will redirect you to the facebook login page.
	 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/9mi5uqxhqlsm5-social-login#call-social-login-api for more details
	 * @example
	 * ```js
	 * cidaasLoginService.loginWithSocial({
	 *   provider: 'facebook',
	 *   requestId: 'your requestId',
	 * });
	 * ```
	 */
	loginWithSocial(options: SocialProviderPathParameter, queryParams?: SocialProviderQueryParameter) {
		try {
			let _serviceURL = this.config.authority + "/login-srv/social/login/" + options.provider.toLowerCase() + "/" + options.requestId;
			if (queryParams && queryParams.dc && queryParams.device_fp) {
				_serviceURL = _serviceURL + "?dc=" + queryParams.dc + "&device_fp=" + queryParams.device_fp;
			}
			window.location.href = _serviceURL;
		} catch (ex) {
			console.log(ex);
		}
	}

	/**
	 * To register with social providers, call **registerWithSocial()**. This will redirect you to the facebook login page.
	 * @example
	 * Note: giving the queryParams is not required.
	 * ```js
	 * queryParams = {
	 *   dc: 'dc',
	 *   device_fp: 'device_fp'
	 * }
	 * cidaasLoginService.registerWithSocial({
	 *   provider: 'facebook',
	 *   requestId: 'your requestId',
	 * }, queryParams);
	 * ```
	 */
	registerWithSocial(options: SocialProviderPathParameter, queryParams?: SocialProviderQueryParameter) {
		try {
			let _serviceURL = this.config.authority + "/login-srv/social/register/" + options.provider.toLowerCase() + "/" + options.requestId;
			if (queryParams && queryParams.dc && queryParams.device_fp) {
				_serviceURL = _serviceURL + "?dc=" + queryParams.dc + "&device_fp=" + queryParams.device_fp;
			}
			window.location.href = _serviceURL;
		} catch (ex) {
			console.log(ex);
		}
	}

	/** 
	* To authenticate without using password, call **passwordlessLogin()**.
	* Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/k1lwsraxk0rjc-login-passwordless-request for more details.
	* @example
	* ```js
	* cidaasLoginService.passwordlessLogin({
	*   requestId: 'your requestId',
	*   sub: 'your user sub',
	*   statusId: 'status id from authenticateMFA()'
	*   verificationType: 'your verificationType. e.g. VerificationType.Email'
	* });
	* ```
	*/
	passwordlessLogin(options: PasswordlessLoginRequest) {
		try {
			const url = this.config.authority + "/login-srv/verification/login";
			const form = Helper.createForm(url, options)
			document.body.appendChild(form);
			form.submit();
		} catch (ex) {
			throw new CustomException(String(ex), 417);
		}
	}

	/**
	* To continue after Consent acceptance, call **consentContinue()**.
	* @example
	* ```js
	* cidaasLoginService.consentContinue({
	*   track_id: 'your track id'
	* });
	* ```
	*/
	consentContinue(options: LoginPrecheckRequest) {
		try {
			const url = this.config.authority + "/login-srv/precheck/continue/" + options.track_id;
			const form = Helper.createForm(url, options)
			document.body.appendChild(form);
			form.submit();
		} catch (ex) {
			throw new CustomException(String(ex), 417);
		}
	}

	/**
	 * To continue after MFA completion, call **mfaContinue()**.
	 * 
	 * @example
	 * ```js
	 * cidaasLoginService.mfaContinue({
	 *   track_id: 'your track id'
	 * });
	 * ```
	 */
	mfaContinue(options: LoginPrecheckRequest) {
		try {
			const url = this.config.authority + "/login-srv/precheck/continue/" + options.track_id;
			const form = Helper.createForm(url, options)
			document.body.appendChild(form);
			form.submit();
		} catch (ex) {
			throw new CustomException(String(ex), 417);
		}
	}

	/**
	 * to handle changing password by first login attempt after registration, call **firstTimeChangePassword()**.
	 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/fd8f478d96f58-continue-authentication-flow-after-prechecks for more details.
	 * @example
	 * ```js
	 * cidaasLoginService.firstTimeChangePassword({
	 *   old_password: 'your old password',
	 *   new_password: 'your new password',
	 *   confirm_password: 'your new password'
	 * }, 'your track id');
	 * ```
	 */
	firstTimeChangePassword(options: FirstTimeChangePasswordRequest, trackId: string) {
		try {
			const url = this.config.authority + "/login-srv/precheck/continue/" + trackId;
			const form = Helper.createForm(url, options)
			document.body.appendChild(form);
			form.submit();
		} catch (ex) {
			throw new CustomException(String(ex), 417);
		}
	}

	/**
	 * For progressive registration, call **progressiveRegistration()**. While logging in If the API returns 417 with the error message MissingRequiredFields, call the **getMissingFields** to get the list of missing fileds and proceed with progressive registration. In the sample request only the required fields are added, however you must provide the missing fields along with the required fields.
	 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/l7sknp2pytryr-progressive-registration for more details.
	 * @example
	 * ```js
	 * const options = {
	 *   sub: 'your sub',
	 * }
	 * const headers = {
	 *   trackId: 'the track id received while logging in',
	 *   requestId: 'request id of the session',
	 *   acceptlanguage: 'your locale/browser locale (OPTIONAL)',
	 * }
	 * cidaasLoginService.progressiveRegistration(options, headers)
	 * .then(function(response) {
	 *   // type your code here
	 * })
	 * .catch(function (ex) {
	 *   // your failure code here
	 * });
	 * ```
	 */
	progressiveRegistration(options: CidaasUser, headers: ProgressiveRegistrationHeader) {
		const serviceURL = this.config.authority + "/login-srv/progressive/update/user";
		return Helper.createHttpPromise(options, serviceURL, undefined, "POST", undefined, headers);
	}

	/**
	 * To automatically do user login after successful registration, call **loginAfterRegister()**. Make sure to turn on  "auto login after register" switch on the admin ui to activate loginAfterRegister flow.
	 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/qwwamc2f378wi-auto-login-after-register for more details.
	 * @example
	 * ```js
	 * cidaasLoginService.loginAfterRegister({
	 *   device_id: 'your device id',
	 *   dc: 'device capacity'
	 *   rememberMe: false,
	 *   trackId: 'your track id',
	 *   device_fp: 'device fingerprint'
	 * });
	 * ```
	 */
	loginAfterRegister(options: LoginAfterRegisterRequest) {
		try {
			const url = this.config.authority + "/login-srv/login/handle/afterregister/" + options.trackId;
			const form = Helper.createForm(url, options)
			document.body.appendChild(form);
			form.submit();
		} catch (ex) {
			throw new CustomException(String(ex), 417);
		}
	}

	/**
	 * To do guest login after activating the feature from admin ui, call **actionGuestLogin()**
	 * Please refer to https://docs.cidaas.com/docs/cidaas-iam/95fd8492a64fe-guest-login for more details
	 * @example
	 * ```js
	 * cidaasLoginService.actionGuestLogin('your request id');
	 * ```
	 */
	actionGuestLogin(requestId: string) {
		const url = this.config.authority + '/login-srv/login/guest/' + requestId
		const loginFormElement = document.getElementsByName('guestLoginForm')[0] as HTMLFormElement;
		loginFormElement.action = url;
		loginFormElement.method = 'post';
		loginFormElement.submit();
	}
}