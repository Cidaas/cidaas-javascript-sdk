import { Helper, CustomException } from "../common/Helper";
import { ChangePasswordRequest, DeduplicationLoginRequest, DeleteUserAccountRequest, GetDeduplicationDetailsRequest, GetInviteUserDetailsRequest, GetUserProfileRequest, HandleResetPasswordRequest, InitiateLinkAccountRequest, InitiateResetPasswordRequest, RegisterDeduplicationRequest, RegisterRequest, ResetPasswordRequest, UserCheckExistsRequest, CompleteLinkAccountRequest, GetCommunicationStatusRequest, GetRegistrationSetupRequest, GetUserActivitiesRequest, UpdateProfileImageRequest, UserActionOnEnrollmentRequest } from "./UserService.model";
import { HTTPRequestHeader } from "../common/Common.model";
import { CidaasUser } from "../common/User.model";
import { OidcManager, OidcSettings } from "../authentication-service/AuthenticationService.model";
import ConfigUserProvider from "../common/ConfigUserProvider";

export class UserService {
	private config: OidcSettings;
	private userManager: OidcManager;

	constructor(configUserProvider: ConfigUserProvider) {
		this.config = configUserProvider.getConfig();
		this.userManager = configUserProvider.getUserManager();
	}

	/**
	 * To get the user profile information by using cidaas internal api, call **getUserProfile()**.
	 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/2zfvjx3vtq6g6-get-user-info for more details.
	 * @example
	 * ```js
	 * cidaas.getUserProfile()
	 * .then(function () {
	 *   // the response will give you user profile information.
	 * }).catch(function (ex) {
	 *   // your failure code here
	 * });
	 * ```
	 */
	getUserProfile(options?: GetUserProfileRequest) {
		const _serviceURL = this.config.authority + "/users-srv/userinfo";
		if (options?.access_token) {
			return Helper.createHttpPromise(undefined, _serviceURL, undefined, "GET", options.access_token);
		}
		return Helper.getAccessTokenFromUserStorage(this.userManager).then((accessToken) => {
			return Helper.createHttpPromise(undefined, _serviceURL, undefined, "GET", accessToken);
		});
	}

	/**
		  * To handle registration, first you need the registration fields. To get the registration fields, call **getRegistrationSetup()**. This will return the fields that has to be needed while registration.
   * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/4eae72956f65a-registration-field-setup for more details.
   * @example
   * ```js
   * cidaas.getRegistrationSetup({
   *   requestId: 'your requestId',
   *   acceptlanguage: 'your locale' // optional example: de-de, en-US
   * }).then(function (resp) {
   *   // the response will give you fields that are required.
   * }).catch(function(ex) {
   *   // your failure code here
   * });
   * ```
   */
	getRegistrationSetup(options: GetRegistrationSetupRequest) {
		const serviceURL = this.config.authority + '/registration-setup-srv/public/list?acceptlanguage=' + options.acceptlanguage + '&requestId=' + options.requestId;
		return Helper.createHttpPromise(undefined, serviceURL, false, 'GET');
	}

	/**
	 * To register user, call **register()**. This method will create a new user.
	 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/427632e587203-register-a-new-user for more details.
	 * Note: Only requestId in the headers is required.
	 * @example
	 * ```js
	 * const headers = {
	 *   requestId: 'your_received_requestId',
	 *   captcha: 'captcha',
	 *   acceptlanguage: 'acceptlanguage',
	 *   bot_captcha_response: 'bot_captcha_response'
	 * };
	 * 
	 * cidaas.register({ 
	 *   email: 'xxx123@xxx.com',  
	 *   given_name: 'xxxxx', 
	 *   family_name: 'yyyyy', 
	 *   password: '123456', 
	 *   password_echo: '123456', 
	 *   provider: 'your provider', // FACEBOOK, GOOGLE, SELF
	 *   acceptlanguage: 'your locale' // optional example: de-de, en-US
	 * }, headers).then(function (response) {
	 *   // the response will give you client registration details.
	 * }).catch(function(ex) {
	 *   // your failure code here
	 * });
	 *```
	 */
	register(options: RegisterRequest, headers: HTTPRequestHeader) {
		let _serviceURL = this.config.authority + "/users-srv/register";
		if (options.invite_id) {
			_serviceURL = _serviceURL + "?invite_id=" + options.invite_id;
		}
		return Helper.createHttpPromise(options, _serviceURL, false, "POST", undefined, headers);
	}

	/**
	 * to get information about invitation details, call **getInviteUserDetails()**. This API allows to retrieve invitation details and prefill the registration form.
	 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/0b5efa5a2db5d-prefill-the-user-invitation for more details.
	 * Minimum cidaas version to use latest api is v3.100
	 * @example
	 * ```js
	 * const options = {
	 *   invite_id: 'id of user invitation'
	 *   callLatestAPI: 'true' // call latest api if parameter is given. By default, the older api will be called
	 * }
	 * cidaas.getInviteUserDetails(options)
	 * .then(function () {
	 *   // the response will give you information about the invitation.
	 * }).catch(function (ex) {
	 *   // your failure code here
	 * });
	 * ```
	 */
	getInviteUserDetails(options: GetInviteUserDetailsRequest, headers?: HTTPRequestHeader) {
		let _serviceURL: string = "";
		if (options.callLatestAPI) {
			_serviceURL = this.config.authority + "/useractions-srv/invitations/" + options.invite_id;
		} else {
			_serviceURL = this.config.authority + "/users-srv/invite/info/" + options.invite_id;
		}
		return Helper.createHttpPromise(undefined, _serviceURL, false, "GET", undefined, headers);
	}

	/**
	 * Once registration successful, verify the account based on the flow. To get the details, call **getCommunicationStatus()**.
	 * @example
	 * ```js
	 * cidaas.getCommunicationStatus({
	 *   sub: 'your sub', // which you will get on the registration response
	 * }).then(function (response) {
	 *   // the response will give you account details once its verified.
	 * }).catch(function(ex) {
	 *   // your failure code here
	 * });
	 * ```
	 */
	getCommunicationStatus(options: GetCommunicationStatusRequest, headers?: HTTPRequestHeader) {
		const _serviceURL = this.config.authority + "/users-srv/user/communication/status/" + options.sub;
		return Helper.createHttpPromise(undefined, _serviceURL, false, "GET", undefined, headers);
	}

	/**
	 * To initiate the password resetting, call **initiateResetPassword()**. This will send verification code to your email or mobile based on the resetMedium you mentioned.
	 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/6b29bac6002f4-initiate-password-reset for more details.
	 * @example
	 * ```js
	 * cidaas.initiateResetPassword({
	 *   email: 'xxxxxx@xxx.com',
	 *   processingType: ProcessingType.Code,
	 *   requestId: 'your requestId',
	 *   resetMedium: ResetMedium.Email
	 * }).then(function (response) {
	 *   // the response will give you password reset details.
	 * }).catch(function(ex) {
	 *   // your failure code here
	 * });
	 * ```
	 */
	initiateResetPassword(options: InitiateResetPasswordRequest, headers?: HTTPRequestHeader) {
		const _serviceURL = this.config.authority + "/users-srv/resetpassword/initiate";
		return Helper.createHttpPromise(options, _serviceURL, false, "POST", undefined, headers);
	}

	/**
	 * To handle the reset password by entering the verification code you received, call **handleResetPassword()**. This will check if your verification code was valid or not, and allows you to proceed to the next step.
	 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/3t8ztokeb7cfz-handle-reset-password for more details.
	 * @example
	 * ```js
	 * const handleResponseAsJson = 'true if the response need to be handled the old way (as json). In the current handling, the response information will be given as query parameter in redirect url.';
	 * cidaas.handleResetPassword({
	 *   code: 'your code in email or sms or ivr',
	 *   resetRequestId: 'your resetRequestId' // which you will get on initiate reset password response
	 * }, handleResponseAsJson).then(function (response) {
	 *   // the response will give you valid verification code.
	 * }).catch(function(ex) {
	 *   // your failure code here
	 * });
	 * ```
	 */
	handleResetPassword(options: HandleResetPasswordRequest, handleResponseAsJson?: boolean, headers?: HTTPRequestHeader) {
		try {
			const url = this.config.authority + "/users-srv/resetpassword/validatecode";
			if (!handleResponseAsJson) {
				// current handling will redirect and give query parameters
				const form = Helper.createForm(url, options)
				document.body.appendChild(form);
				form.submit();
			} else {
				// older cidaas service handling return json object
				return Helper.createHttpPromise(options, url, false, "POST", undefined, headers);
			}
		} catch (ex) {
			throw new CustomException(String(ex), 417);
		}
	}

	/**
	 * To finish reseting the password, call **resetPassword()**. This will allow you to change your password.
	 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/qa9ny0gkzlf6y-accept-reset-password for more details.
	 * @example
	 * ```js
	 * const handleResponseAsJson = 'true if the response need to be handled the old way (as json). In the current handling, user will be redirected to success page after successful reset password.';
	 * cidaas.resetPassword({        
	 *   password: '123456',
	 *   confirmPassword: '123456',
	 *   exchangeId: 'your exchangeId', // which you will get on handle reset password response
	 *   resetRequestId: 'your resetRequestId' // which you will get on handle reset password response
	 * }).then(function (response) {
	 *   // the response will give you reset password details.
	 * }).catch(function(ex) {
	 *   // your failure code here
	 * });
	 * ```
	 */
	resetPassword(options: ResetPasswordRequest, handleResponseAsJson?: boolean, headers?: HTTPRequestHeader) {
		const url = this.config.authority + "/users-srv/resetpassword/accept";
		try {
			if (!handleResponseAsJson) {
				// current handling will redirect and give query parameters
				const form = Helper.createForm(url, options)
				document.body.appendChild(form);
				form.submit();
			} else {
				// older cidaas service handling return json object
				return Helper.createHttpPromise(options, url, false, "POST", undefined, headers);
			}
		} catch (ex) {
			throw new CustomException(String(ex), 417);
		}
	}

	/**
	 * To get the list of existing users in deduplication, call **getDeduplicationDetails()**.
	 * @example
	 * ```js
	 * this.cidaas.getDeduplicationDetails({
	 *   track_id: 'your track id'
	 * }).then((response) => {
	 *   // the response will give you deduplication details of users.
	 * }).catch((err) => {
	 *   // your failure code here
	 * });
	 * ```
	 */
	getDeduplicationDetails(options: GetDeduplicationDetailsRequest, headers?: HTTPRequestHeader) {
		const _serviceURL = this.config.authority + "/users-srv/deduplication/info/" + options.trackId;
		return Helper.createHttpPromise(options, _serviceURL, false, "GET", undefined, headers);
	}

	/**
	 * To use the existing users in deduplication, you need to call **deduplicationLogin()**.
	 * @example
	 * ```js
	 * this.cidaas.deduplicationLogin({
	 *   sub: 'your sub',
	 *   requestId: 'request id from deduplication initialisation after register',
	 *   trackId: 'track id from deduplication initialisation after register'
	 * })
	 * ```
	 */
	deduplicationLogin(options: DeduplicationLoginRequest) {
		try {
			const url = this.config.authority + "/users-srv/deduplication/login/redirection?trackId=" + options.trackId + "&requestId=" + options.requestId + "&sub=" + options.sub;
			const form = Helper.createForm(url, {});
			document.body.appendChild(form);
			form.submit();
		} catch (ex) {
			throw new CustomException(String(ex), 417);
		}
	}

	/**
	 * To register new user in deduplication, call **registerDeduplication()**.
	 * @example
	 * ```js
	 * this.cidaas.registerDeduplication({
	 *   track_id: 'track id from deduplication initialisation after register',
	 * }).then((response) => {
	 *   // the response will give you new registered deduplication user. 
	 * }).catch((err) => {
	 *   // your failure code here
	 * });
	 * ```
	 */
	registerDeduplication(options: RegisterDeduplicationRequest, headers?: HTTPRequestHeader) {
		const _serviceURL = this.config.authority + "/users-srv/deduplication/register/" + options.trackId;
		return Helper.createHttpPromise(undefined, _serviceURL, undefined, "POST", undefined, headers);
	}

	/**
	 * To change the password, call **changePassword()**. This will allow you to change your password.
	 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/8221883241464-change-password for more details.
	 * @example
	 * ```js
	 * cidaas.changePassword({
	 *   old_password: 'your old password',
	 *   new_password: 'your new password',
	 *   confirm_password: 'your new password',
	 *   sub: 'your sub',
	 * })
	 * .then(function () {
	 *   // your success code
	 * }).catch(function (ex) {
	 *   // your failure code
	 * });
	 * ```
	 */
	changePassword(options: ChangePasswordRequest, access_token?: string) {
		const _serviceURL = this.config.authority + "/users-srv/changepassword";
		if (access_token) {
			return Helper.createHttpPromise(options, _serviceURL, false, "POST", access_token);
		}
		return Helper.getAccessTokenFromUserStorage(this.userManager).then((accessToken) => {
			return Helper.createHttpPromise(options, _serviceURL, false, "POST", accessToken);
		});
	}

	/**
	 * To update the user profile information, call **updateProfile()**.
	 * After updating the user profile, the information in user storage won't be automatically updated.
	 * To get the latest user profile information, you will need to call **getUserProfile()**.
	 * To update the user storage, you will need to call **renewToken()** to generate latest tokens (access token, id token, refresh token) & user informations.
	 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/i3uqnxcpxr19r-update-user-profile for more details.
	 * @example
	 * ```js
	 * cidaas.updateProfile({
	 *   family_name: 'Doe',
	 *   given_name: 'John',
	 *   provider: 'self',
	 *   acceptlanguage: 'your locale' // optional example: de-de, en-US
	 * }, 'your sub' ).then(function () {
	 *   // the response will give you updated user profile info.
	 * }).catch(function (ex) {
	 *   // your failure code here
	 * });
	 * ```
	 */
	updateProfile(options: CidaasUser, sub: string, access_token?: string) {
		const _serviceURL = this.config.authority + "/users-srv/user/profile/" + sub;
		if (access_token) {
			return Helper.createHttpPromise(options, _serviceURL, false, "PUT", access_token)
		}
		return Helper.getAccessTokenFromUserStorage(this.userManager).then((accessToken) => {
			return Helper.createHttpPromise(options, _serviceURL, false, "PUT", accessToken);
		});
	}

	/**
	 * To initiate account linking, call **initiateLinkAccount()**.
	 * @example
	 * ```js
	 * const options = {
	 *   master_sub: 'sub of the user who initiates the user link',
	 *   user_name_to_link: 'username of the user which should get linked',
	 *   user_name_type: 'type of user name to link. E.g. email'
	 * }
	 * this.cidaas.initiateLinkAccount(options).then((response) => {
	 *   // your success code
	 * }).catch((err) => {
	 *   // your failure code here 
	 * });
	 * ```
	 */
	initiateLinkAccount(options: InitiateLinkAccountRequest, access_token?: string) {
		options.user_name_type = 'email';
		const _serviceURL = this.config.authority + "/users-srv/user/link/initiate";
		if (access_token) {
			return Helper.createHttpPromise(options, _serviceURL, false, "POST", access_token);
		}
		return Helper.getAccessTokenFromUserStorage(this.userManager).then((accessToken) => {
			return Helper.createHttpPromise(options, _serviceURL, false, "POST", accessToken);
		});
	}

	/**
	 * To complete account linking, call **completeLinkAccount()**.
	 * @example
	 * ```js
	 * const options = {
	 *   code: 'code which is sent to account to be linked',
	 *   link_request_id: 'comes from initiateLinkAccount'
	 * }
	 * this.cidaas.completeLinkAccount(options).then((response) => {
	 *   // your success code
	 * }).catch((err) => {
	 *   // your failure code here 
	 * });
	 * ```
	 */
	completeLinkAccount(options: CompleteLinkAccountRequest, access_token?: string) {
		const _serviceURL = this.config.authority + "/users-srv/user/link/complete";
		if (access_token) {
			return Helper.createHttpPromise(options, _serviceURL, false, "POST", access_token);
		}
		return Helper.getAccessTokenFromUserStorage(this.userManager).then((accessToken) => {
			return Helper.createHttpPromise(options, _serviceURL, false, "POST", accessToken);
		});
	}

	/**
	 * To get all the linked accounts, call **getLinkedUsers()**.
	 * @example
	 * ```js
	 * const sub = 'your sub';
	 * 
	 * cidaas.getLinkedUsers(sub)
	 * .then(function (response) {
	 *   // type your code here
	 * })
	 * .catch(function (ex) {
	 *   // your failure code here
	 * });
	 * ```
	 */
	getLinkedUsers(sub: string, access_token?: string) {
		const _serviceURL = this.config.authority + "/users-srv/userinfo/social/" + sub;
		if (access_token) {
			return Helper.createHttpPromise(undefined, _serviceURL, false, "GET", access_token);
		}
		return Helper.getAccessTokenFromUserStorage(this.userManager).then((accessToken) => {
			return Helper.createHttpPromise(undefined, _serviceURL, false, "GET", accessToken);
		});
	}

	/**
	 * To unlink an account for a user, call **unlinkAccount()**.
	 * @example
	 * ```js
	 * const identityId = "comes from getLinkedUsers";
	 * 
	 * cidaas.unlinkAccount(undefined, identityId)
	 * .then(function (response) {
	 *   // type your code here
	 * })
	 * .catch(function (ex) {
	 *   // your failure code here
	 * });
	 * ```
	 */
	unlinkAccount(access_token: string | undefined, identityId: string) {
		if (!identityId) {
			throw new CustomException("identityId cannot be empty", 417);
		}
		const _serviceURL = this.config.authority + "/users-srv/user/unlink/" + identityId;
		if (access_token) {
			return Helper.createHttpPromise(undefined, _serviceURL, false, "POST", access_token);
		}
		return Helper.getAccessTokenFromUserStorage(this.userManager).then((accessToken) => {
			return Helper.createHttpPromise(undefined, _serviceURL, false, "POST", accessToken);
		});
	}

	/**
	 * To delete the user account directly in the application, call **deleteUserAccount()**.
	 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/x133xdifl1sx9-schedule-user-deletion for more details.
	 * @example
	 * ```js
	 * options = {
	 *   sub: "your sub"
	 * }
	 * 
	 * cidaas.deleteUserAccount(options).then(function (response) {
	 *   // your success code
	 * }).catch(function(ex) {
	 *   // your failure code here
	 * });
	 * ```
	 */
	deleteUserAccount(options: DeleteUserAccountRequest) {
		const _serviceURL = this.config.authority + "/users-srv/user/unregister/scheduler/schedule/" + options.sub;
		if (options.access_token) {
			return Helper.createHttpPromise(options, _serviceURL, undefined, "POST", options.access_token);
		}
		return Helper.getAccessTokenFromUserStorage(this.userManager).then((accessToken) => {
			return Helper.createHttpPromise(options, _serviceURL, undefined, "POST", accessToken);
		});
	}


	/**
	 * To check if user exists, call **userCheckExists()**.
	 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/4yh82qism78xf-find-user-by-identifier for more details.
	 * @example
	 * options = {
	 *   requestId: "your request id",
	 *   email: "your email"
	 * }
	 * 
	 * cidaas.userCheckExists(options).then(function (response) {
	 *   // your success code
	 * }).catch(function(ex) {
	 *   // your failure code here
	 * });
	 * ```
	 */
	userCheckExists(options: UserCheckExistsRequest, headers?: HTTPRequestHeader) {
		let queryParameter = ''
		if (options.webfinger || options.rememberMe) {
			queryParameter += '?';
			if (options.webfinger) {
				queryParameter += 'webfinger=' + options.webfinger;
				if (options.rememberMe) {
					queryParameter += '&rememberMe=' + options.rememberMe;
				}
			} else if (options.rememberMe) {
				queryParameter += 'rememberMe=' + options.rememberMe;
			}
		}
		const _serviceURL = this.config.authority + "/useractions-srv/userexistence/" + options.requestId + queryParameter;
		return Helper.createHttpPromise(options, _serviceURL, undefined, "POST", undefined, headers);
	}

	/**
   * To get user activities, call **getUserActivities()**.
   * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/346141453781e-get-user-activities for more details.
   * @example
   * ```js
   * const options = {
   *   sub: 'your sub',
   *   dateFilter: {
   *     from_date: 'date in UTC format',
   *     to:date: 'date in UTC format'
   *   }
   * };
   * cidaas.getUserActivities(options).then(function (resp) {
   *   // your success code
   * }).catch(function(ex) {
   *   // your failure code
   * });
   * ```
   */
	getUserActivities(options: GetUserActivitiesRequest, access_token?: string) {
		const serviceURL = this.config.authority + '/activity-streams-srv/user-activities';
		if (access_token) {
			return Helper.createHttpPromise(options, serviceURL, false, 'POST', access_token);
		}
		return Helper.getAccessTokenFromUserStorage(this.userManager).then((accessToken) => {
			return Helper.createHttpPromise(options, serviceURL, false, 'POST', accessToken);
		});
	}

	/**
	* To change profile image, call **updateProfileImage()**.
	* @example
	* ```js
	* const options = {
	*   image_key: 'id for your image e.g. user sub',
	*   photo: yourImageFile,
	*   filename: 'name of your image file'
	* };
	* cidaas.updateProfileImage(options).then(function (resp) {
	*   // your success code
	* }).catch(function(ex) {
	*   // your failure code
	* });
	* ```
	*/
	updateProfileImage(options: UpdateProfileImageRequest, access_token?: string) {
		const serviceURL = this.config.authority + "/image-srv/profile/upload";

		const form = document.createElement('form');
		form.action = serviceURL;
		form.method = 'POST';

		const image_key = document.createElement('input');
		image_key.setAttribute('type', 'hidden');
		image_key.setAttribute('name', 'image_key');
		form.appendChild(image_key);

		const photo = document.createElement('input');
		photo.setAttribute('type', 'file');
		photo.setAttribute('hidden', 'true');
		photo.setAttribute("name", "photo");
		form.appendChild(photo);

		const formdata = new FormData(form);
		formdata.set('image_key', options.image_key);
		formdata.set('photo', options.photo, options.filename);

		if (access_token) {
			return Helper.createHttpPromise(options, serviceURL, undefined, 'POST', access_token, null, formdata);
		}
		return Helper.getAccessTokenFromUserStorage(this.userManager).then((accessToken) => {
			return Helper.createHttpPromise(options, serviceURL, undefined, 'POST', accessToken, null, formdata);
		});

	}

	/**
	 * To run predefined action after enrollment, call userActionOnEnrollment()
	 * @param options 
	 * @param trackId 
	 * @example
	 * ```js
	 * const options = {
	 *   action: 'predefined action'
	 * };
	 * cidaas.userActionOnEnrollment(options, 'trackId');
	 */
	userActionOnEnrollment(options: UserActionOnEnrollmentRequest, trackId: string) {
		const serviceURL = this.config.authority + '/auth-actions-srv/validation/' + trackId;
		return Helper.createHttpPromise(options, serviceURL, false, 'POST');
	}

}
