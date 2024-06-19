import {
  UserEntity,
  ResetPasswordEntity,
  FindUserEntity,
  IUserLinkEntity,
  ChangePasswordEntity,
  ValidateResetPasswordEntity,
  AcceptResetPasswordEntity
} from "../web-auth/Entities"
import { Helper, CustomException } from "../common/Helper";
import { GetInviteUserDetailsRequest, GetUserProfileRequest, HandleResetPasswordRequest, InitiateResetPasswordRequest, ResetPasswordRequest, getCommunicationStatusRequest } from "./UserService.model";
import { HTTPRequestHeader } from "../common/Common.model";

/**
 * To get the user profile information by using cidaas internal api, call **getUserProfile()**.
 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/2zfvjx3vtq6g6-get-user-info for more details.
 * @example
 * ```js
 * const options = {
 *   access_token: 'your access token'
 * }
 * cidaas.getUserProfile(options)
 * .then(function () {
 *   // the response will give you user profile information.
 * }).catch(function (ex) {
 *   // your failure code here
 * });
 * ```
 */
export function getUserProfile(options: GetUserProfileRequest) {
  if (!options.access_token) {
    throw new CustomException("access_token cannot be empty", 417);
  }
  const _serviceURL = window.webAuthSettings.authority + "/users-srv/userinfo";
  return Helper.createHttpPromise(undefined, _serviceURL, undefined, "GET", options.access_token);
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
// TODO: update type for option parameter (Cidaas User model for public usage)
export function register(options: any, headers: HTTPRequestHeader) {
  let _serviceURL = window.webAuthSettings.authority + "/users-srv/register";
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
export function getInviteUserDetails(options: GetInviteUserDetailsRequest) {
  let _serviceURL: string = "";
  if(options.callLatestAPI){
    _serviceURL = window.webAuthSettings.authority + "/useractions-srv/invitations/" + options.invite_id;
  }else{
    _serviceURL = window.webAuthSettings.authority + "/users-srv/invite/info/" + options.invite_id;
  }
  return Helper.createHttpPromise(undefined, _serviceURL, false, "GET");
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
export function getCommunicationStatus(options: getCommunicationStatusRequest, headers?: HTTPRequestHeader) {
  const _serviceURL = window.webAuthSettings.authority + "/users-srv/user/communication/status/" + options.sub;
  return Helper.createHttpPromise(undefined, _serviceURL, false, "GET", undefined, headers);
}

/**
 * To initiate the password resetting, call **initiateResetPassword()**. This will send verification code to your email or mobile based on the resetMedium you mentioned.
 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/6b29bac6002f4-initiate-password-reset for more details.
 * @example
 * ```js
 * cidaas.initiateResetPassword({
 *   email: 'xxxxxx@xxx.com',
 *   processingType: 'CODE',
 *   requestId: 'your requestId',
 *   resetMedium: 'email'
 * }).then(function (response) {
 *   // the response will give you password reset details.
 * }).catch(function(ex) {
 *   // your failure code here
 * });
 * ```
 */
export function initiateResetPassword(options: InitiateResetPasswordRequest) {
  const _serviceURL = window.webAuthSettings.authority + "/users-srv/resetpassword/initiate";
  return Helper.createHttpPromise(options, _serviceURL, false, "POST");
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
export function handleResetPassword(options: HandleResetPasswordRequest, handleResponseAsJson?: boolean) {
  try {
    const url = window.webAuthSettings.authority + "/users-srv/resetpassword/validatecode";
    if (!handleResponseAsJson) {
      // current handling will redirect and give query parameters
      const form = Helper.createForm(url, options)
      document.body.appendChild(form);
      form.submit();
    } else {
      // older cidaas service handling return json object
      return Helper.createHttpPromise(options, url, false, "POST");
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
export function resetPassword(options: ResetPasswordRequest, handleResponseAsJson?: boolean) {
  const url = window.webAuthSettings.authority + "/users-srv/resetpassword/accept";
  try {
    if (!handleResponseAsJson) {
      // current handling will redirect and give query parameters
      const form = Helper.createForm(url, options)
      document.body.appendChild(form);
      form.submit();
    } else {
      // older cidaas service handling return json object
      return Helper.createHttpPromise(options, url, false, "POST");
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
export function getDeduplicationDetails(options: { trackId: string }) {
  const _serviceURL = window.webAuthSettings.authority + "/users-srv/deduplication/info/" + options.trackId;
  return Helper.createHttpPromise(options, _serviceURL, false, "GET");
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
export function deduplicationLogin(options: { trackId: string, requestId: string, sub: string }) {
  try {
    const url = window.webAuthSettings.authority + "/users-srv/deduplication/login/redirection?trackId=" + options.trackId + "&requestId=" + options.requestId + "&sub=" + options.sub;
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
export function registerDeduplication(options: { trackId: string }) {
  const _serviceURL = window.webAuthSettings.authority + "/users-srv/deduplication/register/" + options.trackId;
  return Helper.createHttpPromise(undefined, _serviceURL, undefined, "POST");
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
 * }, 'your access token')
 * .then(function () {
 *   // your success code
 * }).catch(function (ex) {
 *   // your failure code
 * });
 * ```
 */
export function changePassword(options: ChangePasswordEntity, access_token: string) {
  const _serviceURL = window.webAuthSettings.authority + "/users-srv/changepassword";
  return Helper.createHttpPromise(options, _serviceURL, false, "POST", access_token);
}

/**
 * To update the user profile information, call **updateProfile()**.
 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/i3uqnxcpxr19r-update-user-profile for more details.
 * @example
 * ```js
 * cidaas.updateProfile({
 *   family_name: 'Doe',
 *   given_name: 'John',
 *   provider: 'self',
 *   acceptlanguage: 'your locale' // optional example: de-de, en-US
 * }, 'your access token', 'your sub').then(function () {
 *   // the response will give you updated user profile info.
 * }).catch(function (ex) {
 *   // your failure code here
 * });
 * ```
 */
export function updateProfile(options: UserEntity, access_token: string, sub: string) {
  const _serviceURL = window.webAuthSettings.authority + "/users-srv/user/profile/" + sub;
  return Helper.createHttpPromise(options, _serviceURL, false, "PUT", access_token);
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
 * const access_token = 'your access token'
 * this.cidaas.initiateLinkAccount(options, access_token).then((response) => {
 *   // your success code
 * }).catch((err) => {
 *   // your failure code here 
 * });
 * ```
 */
export function initiateLinkAccount(options: IUserLinkEntity, access_token: string) {
  options.user_name_type = 'email';
  const _serviceURL = window.webAuthSettings.authority + "/users-srv/user/link/initiate";
  return Helper.createHttpPromise(options, _serviceURL, false, "POST", access_token);
}

/**
 * To complete account linking, call **completeLinkAccount()**.
 * @example
 * ```js
 * const options = {
 *   code: 'code which is sent to account to be linked',
 *   link_request_id: 'comes from initiateLinkAccount'
 * }
 * const access_token = 'your access token'
 * this.cidaas.completeLinkAccount(options, access_token).then((response) => {
 *   // your success code
 * }).catch((err) => {
 *   // your failure code here 
 * });
 * ```
 */
export function completeLinkAccount(options: { code?: string; link_request_id?: string; }, access_token: string) {
  const _serviceURL = window.webAuthSettings.authority + "/users-srv/user/link/complete";
  return Helper.createHttpPromise(options, _serviceURL, false, "POST", access_token);
}

/**
 * To get all the linked accounts, call **getLinkedUsers()**.
 * @example
 * ```js
 * const acccess_token= 'your access token';
 * const sub = 'your sub';
 * 
 * cidaas.getLinkedUsers(access_token, sub)
 * .then(function (response) {
 *   // type your code here
 * })
 * .catch(function (ex) {
 *   // your failure code here
 * });
 * ```
 */
export function getLinkedUsers(access_token: string, sub: string) {
  const _serviceURL = window.webAuthSettings.authority + "/users-srv/userinfo/social/" + sub;
  return Helper.createHttpPromise(undefined, _serviceURL, false, "GET", access_token);
}

/**
 * To unlink an account for a user, call **unlinkAccount()**.
 * @example
 * ```js
 * const acccess_token= "your access token";
 * const identityId = "comes from getLinkedUsers";
 * 
 * cidaas.unlinkAccount(access_token, identityId)
 * .then(function (response) {
 *   // type your code here
 * })
 * .catch(function (ex) {
 *   // your failure code here
 * });
 * ```
 */
export function unlinkAccount(access_token: string, identityId: string) {
  const _serviceURL = window.webAuthSettings.authority + "/users-srv/user/unlink/" + identityId;
  return Helper.createHttpPromise(undefined, _serviceURL, false, "POST", access_token);
}

/**
 * To delete the user account directly in the application, call **deleteUserAccount()**.
 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/x133xdifl1sx9-schedule-user-deletion for more details.
 * @example
 * ```js
 * options = {
 *   access_token: "your access token",
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
export function deleteUserAccount(options: { access_token: string, sub: string }) {
  const _serviceURL = window.webAuthSettings.authority + "/users-srv/user/unregister/scheduler/schedule/" + options.sub;
  return Helper.createHttpPromise(options, _serviceURL, undefined, "POST", options.access_token);
}


/**
 * To check if user exists, call **userCheckExists()**.
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
export function userCheckExists(options: FindUserEntity) {
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
  const _serviceURL = window.webAuthSettings.authority + "/useractions-srv/userexistence/" + options.requestId + queryParameter;
  return Helper.createHttpPromise(options, _serviceURL, undefined, "POST");
}
