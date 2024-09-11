import { Helper, CustomException } from "../common/Helper";
import * as LoginService from "../login-service/LoginService";
import * as UserService from "../user-service/UserService";
import * as TokenService from "../token-service/TokenService";
import * as VerificationService from "../verification-service/VerificationService";
import * as ConsentService from "../consent-service/ConsentService";

import {
  IUserActivityPayloadEntity,
} from "./Entities"
import { GetAccessTokenRequest, RenewTokenRequest, TokenIntrospectionRequest } from '../token-service/TokenService.model';
import { AcceptClaimConsentRequest, AcceptConsentRequest, AcceptScopeConsentRequest, GetConsentVersionDetailsRequest, RevokeClaimConsentRequest } from '../consent-service/ConsentService.model';
import { FirstTimeChangePasswordRequest, LoginAfterRegisterRequest, LoginWithCredentialsRequest, MfaContinueRequest, PasswordlessLoginRequest, ProgressiveRegistrationHeader, SocialProviderPathParameter, SocialProviderQueryParameter } from '../login-service/LoginService.model';
import { LoginPrecheckRequest } from '../common/Common.model';
import { CidaasUser } from '../common/User.model';
import { ChangePasswordRequest, CompleteLinkAccountRequest, DeduplicationLoginRequest, DeleteUserAccountRequest, GetDeduplicationDetailsRequest, GetInviteUserDetailsRequest, GetUserProfileRequest, HandleResetPasswordRequest, InitiateLinkAccountRequest, InitiateResetPasswordRequest, RegisterDeduplicationRequest, RegisterRequest, ResetPasswordRequest, UserCheckExistsRequest, getCommunicationStatusRequest } from '../user-service/UserService.model';
import { HTTPRequestHeader } from "../common/Common.model";
import { User } from "oidc-client-ts";
import { Authentication } from "../authentication/Authentication";
import { OidcSettings, OidcManager, LoginRedirectOptions, PopupSignInOptions, SilentSignInOptions, LogoutRedirectOptions, PopupSignOutOptions, LogoutResponse, LoginRequestOptions } from "../authentication/Authentication.model";
import { AuthenticateMFARequest, CancelMFARequest, CheckVerificationTypeConfiguredRequest, EnrollVerificationRequest, GetMFAListRequest, InitiateAccountVerificationRequest, InitiateEnrollmentRequest, InitiateMFARequest, VerifyAccountRequest } from "../verification-service/VerificationService.model";
import { GetClientInfoRequest, LogoutUserRequest } from "./webauth.model";

export const createPreloginWebauth = (authority: string) => {
  return new WebAuth({'authority': authority} as OidcSettings);
}

export class WebAuth {

  constructor(settings: OidcSettings) {
    try {
      if (!settings.response_type) {
        settings.response_type = "code";
      }
      if (!settings.scope) {
        settings.scope = "email openid profile mobile";
      }
      if (settings.authority && settings.authority.charAt(settings.authority.length - 1) === '/' ) {
        settings.authority = settings.authority.slice(0, settings.authority.length - 1);
      }
      const usermanager = new OidcManager(settings);
      window.webAuthSettings = settings;
      window.usermanager = usermanager;
      window.localeSettings = null;
      window.authentication = new Authentication(window.webAuthSettings, window.usermanager);
      window.usermanager.events.addSilentRenewError(function () {
        throw new CustomException("Error while renewing silent login", 500);
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  // prototype methods 
  /**
   * Generate and redirect to authz url in same window for logging in.
   * @param {LoginRedirectOptions} options options options to over-ride the client config for redirect login
   */
  loginWithBrowser(options?: LoginRedirectOptions) {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.loginOrRegisterWithBrowser('login', options);
  }

  /**
   * Generate and open authz url in a popup window.
   * On successful sign in, authenticated user is returned.
   *
   * @param {PopupSignInOptions} options options to over-ride the client config for popup sign in
   * @returns {Promise<User>} Authenticated user
   * @throws error if unable to get the parse and get user
   */
  popupSignIn(options?: PopupSignInOptions): Promise<User> {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.popupSignIn(options);
  }

  /**
   * Generate and navigate to authz url in an iFrame.
   * On successful sign in, authenticated user is returned
   *
   * @param {SilentSignInOptions} options options to over-ride the client config for silent sign in
   * @returns {Promise<User>} Authenticated user
   * @throws error if unable to get the parse and get user
   */
  silentSignIn(options?: SilentSignInOptions): Promise<User> {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.silentSignIn(options);
  }

  /**
   * Generate and redirect to authz url in same window for register view.
   * @param {LoginRedirectOptions} options options options to over-ride the client config for redirect login
   */
  registerWithBrowser(options?: LoginRedirectOptions): Promise<void> {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.loginOrRegisterWithBrowser('register', options);
  }

  /**
   * Once login successful, it will automatically redirects you to the redirect url whatever you mentioned in the options.
   * To complete the login process, call **loginCallback()**. This will parses the access_token, id_token and whatever in hash in the redirect url.
   *
   * @param {string} url optional url from where to process the login state
   * @returns {Promise<User>} Authenticated user
   * @throws error if unable to get the parse and get user
   */
  loginCallback(url?: string): Promise<User> {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.loginCallback(url);
  }

  /**
   * To complete the popup login process, call **popupSignInCallback()** from the popup login window.
   * Popup window will be closed after doing callback
   *
   * @param {string} url optional url to read sign-in callback state from
   * @param {boolean} keepOpen true to keep the popup open even after sign in, else false
   */
  popupSignInCallback(url?: string, keepOpen?: boolean) {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.popupSignInCallback(url, keepOpen);
  }

  /**
   * Returns a promise to notify the parent window of response from authz service
   * @param {string} url optional url to check authz response, if none window.location is used
   */
  silentSignInCallback(url?: string) {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.silentSignInCallback(url);
  }

  /**
   * To get the user profile information by using oidc-client-ts library, call **getUserInfo()**. This will return the basic user profile details along with groups, roles and whatever scopes you mentioned in the options.
   * @example
   * ```js
   * cidaas.getUserInfo().then(function (response) {
   *   // the response will give you profile details.
   * }).catch(function(ex) {
   *   // your failure code here
   * });
   * ```
   * @return {Promise<User|null>} returns authenticated user if present, else null
   */
  async getUserInfo(): Promise<User | null> {
    if (!window.usermanager) {
      return Promise.reject(new CustomException("UserManager cannot be empty", 417));
    }
    return await window.usermanager.getUser();
  }

  /**
   * logout by using oidc-client-ts library
   * @param {LogoutRedirectOptions} options optional options to over-ride logout options on redirect
   */
  logout(options?: LogoutRedirectOptions) {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.logout(options);
  }

  /**
   * logout by using oidc-client-ts library
   * @param {PopupSignOutOptions} options optional options to over-ride logout options using popup window
   */
  popupSignOut(options?: PopupSignOutOptions) {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.popupSignOut(options);
  }

  /**
   * get the logout call state from the url provided, if none is provided current window url is used
   * @returns {Promise<LogoutResponse>} logout response from auth service
   */
  logoutCallback(url?: string): Promise<LogoutResponse> {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.logoutCallback(url);
  }

  /**
   * listen to popup sign out event
   * @param {string} url optional url to override to check for sign out state
   * @param {boolean} keepOpen true to keep the popup open even after sign out, else false
   */
  popupSignOutCallback(url?: string, keepOpen?: boolean) {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    url = url || window.webAuthSettings.post_logout_redirect_uri;

    return window.authentication.popupSignOutCallback(url, keepOpen);
  }  

  /**
   * To get the generated login url, call **getLoginURL()**. This will call authz service and generate login url to be used.
   * @example
   * ```js
   * cidaas.getLoginURL().then(function (response) {
   *   // the response will give you login url.
   * }).catch(function(ex) {
   *   // your failure code here
   * });
   * ```
   * @param {LoginRequestOptions} options login options to override {@link window.webAuthSettings} provided
   * @return {Promise<string>} authz url for login
   */
  getLoginURL(options?: LoginRequestOptions): Promise<string> {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return new Promise<string>((resolve, reject) => {
      window.usermanager.getClient().createSigninRequest({
        ...window.webAuthSettings,
        ...( options && { options } || {})
      }).then((signinRequest: { url: string }) => {
        resolve(signinRequest.url);
      }).catch(e => {
        reject(e);
      }); 
    });
  }

  /**
   * Each and every proccesses starts with requestId, it is an entry point to login or register. For getting the requestId, call **getRequestId()**.
   * @example
   * ```js
   * cidaas.getRequestId().then(function (response) {
   *   // the response will give you request id.
   * }).catch(function(ex) {
   *   // your failure code here
   * });
   * ``` 
   */
  getRequestId() {
    const ui_locales = window.webAuthSettings.ui_locales
    const options = {
      'client_id': window.webAuthSettings.client_id,
      'redirect_uri': window.webAuthSettings.redirect_uri,
      'response_type': window.webAuthSettings.response_type ?? 'token',
      "response_mode": window.webAuthSettings.response_mode ?? 'fragment',
      "scope": window.webAuthSettings.scope,
      "nonce": new Date().getTime().toString(),
      ...(ui_locales && { ui_locales } || {})
    };
    const serviceURL = window.webAuthSettings.authority + '/authz-srv/authrequest/authz/generate';
    return Helper.createHttpPromise(options, serviceURL, false, "POST");
  }

  /**
   * To get the tenant basic information, call **getTenantInfo()**. This will return the basic tenant details such as tenant name and allowed login with types (Email, Mobile, Username).
   * @example
   * ```js
   * cidaas.getTenantInfo().then(function (response) {
   *   // the response will give you tenant details
   * }).catch(function(ex) {
   *   // your failure code here
   * });
   * ``` 
   */
  getTenantInfo() {
    const _serviceURL = window.webAuthSettings.authority + "/public-srv/tenantinfo/basic";
    return Helper.createHttpPromise(undefined, _serviceURL,false, "GET");
  }

  /**
   * To logout the user by using cidaas internal api, call **logoutUser()**.
   * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/3b5ce6a54bf29-logout for more details.
   * @example
   * ```js
   * cidaas.logoutUser({
   *   access_token : 'your accessToken'
   * });
   * ```
   */
  logoutUser(options: LogoutUserRequest) {
    window.location.href = window.webAuthSettings.authority + "/session/end_session?access_token_hint=" + options.access_token + "&post_logout_redirect_uri=" + window.webAuthSettings.post_logout_redirect_uri;
  }

  /**
   * To get the client basic information, call **getClientInfo()**. This will return the basic client details such as client name and its details.
   * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/dc8a6cfb28abb-public-page-information for more details.
   * @example
   * ```js
   * cidaas.getClientInfo({
   *   requestId: 'your requestId',
   * }).then(function (resp) {
   *   // the response will give you client info.
   * }).catch(function(ex) {
   *   // your failure code here
   * });
   * ```
   */
  getClientInfo(options: GetClientInfoRequest) {
    const _serviceURL = window.webAuthSettings.authority + "/public-srv/public/" + options.requestId;
    return Helper.createHttpPromise(undefined, _serviceURL,false, "GET");
  }

  /**
   * To get all devices information associated to the client, call **getDevicesInfo()**
   * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/2a2feed70303c-get-device-by-user for more details.
   * @example
   * ```js
   * const options = null; // the payload is deprecated and will be removed in the next major release
   * const accessToken = 'your access token';
   * cidaas.getDevicesInfo(options, accessToken).then(function (resp) {
   *   // the response will give you devices informations.
   * }).catch(function(ex) {
   *   // your failure code here
   * });
   * ```
   */
  getDevicesInfo(options: void, accessToken: string) {
    options = undefined;
    const _serviceURL = window.webAuthSettings.authority + "/device-srv/devices";
    return Helper.createHttpPromise(options, _serviceURL,false, "GET", accessToken);
  }

  /**
   * To delete device associated to the client, call **deleteDevice()**
   * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/3d44ad903d6e8-logout-the-user-for-a-device for more details.
   * @example
   * ```js
   * const options = {
   *   device_id: 'id of device associated to the client.' // call **getDevicesInfo()** to get List of device ids and its details.
   * };
   * const accessToken = 'your access token';
   * cidaas.deleteDevice(options, accessToken).then(function (resp) {
   *   // your success code
   * }).catch(function(ex) {
   *   // your failure code
   * });
   * ```
   */
  deleteDevice(options: { device_id: string; userAgent?: string }, accessToken: string) {
    const _serviceURL = window.webAuthSettings.authority + "/device-srv/device/" + options.device_id;
    options.userAgent = window.navigator.userAgent;
    if (window.navigator.userAgent) {
      return Helper.createHttpPromise(options, _serviceURL,false, "DELETE", accessToken);
    }
    return Helper.createHttpPromise(undefined, _serviceURL,false, "DELETE", accessToken);
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
  getRegistrationSetup(options: { acceptlanguage?: string; requestId: string }) {
    const serviceURL = window.webAuthSettings.authority + '/registration-setup-srv/public/list?acceptlanguage=' + options.acceptlanguage + '&requestId=' + options.requestId;
    return Helper.createHttpPromise(undefined, serviceURL, false, 'GET');
  }

  /**
   * to generate device info, call **createDeviceInfo()**.
   * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/9b5a892afaf0b-create-device-info for more details.
   * @example
   * ```js
   * cidaas.createDeviceInfo().then(function (resp) {
   *   // your success code
   * }).catch(function(ex) {
   *   // your failure code
   * });
   * ```
   */
  createDeviceInfo() {
    const value = ('; ' + document.cookie).split(`; cidaas_dr=`).pop().split(';')[0];
    if (!value) {
      const options = { 
        userAgent: window.navigator.userAgent
      };
      const serviceURL = window.webAuthSettings.authority + '/device-srv/deviceinfo';
      return Helper.createHttpPromise(options, serviceURL, false, 'POST');
    }
  }

  /**
   * get the user profile information
   * @param options 
   * @returns 
   */
  getUserProfile(options: GetUserProfileRequest) {
    return UserService.getUserProfile(options);
  }

  /**
   * renew token using refresh token
   * @param options 
   * @returns 
   */
  renewToken(options: RenewTokenRequest) {
    return TokenService.renewToken(options);
  }

  /**
   * get access token from code
   * @param options 
   * @returns 
   */
  getAccessToken(options: GetAccessTokenRequest) {
    return TokenService.getAccessToken(options);
  }

  /**
   * validate access token
   * @param options 
   * @returns 
   */
  validateAccessToken(options: TokenIntrospectionRequest) {
    return TokenService.validateAccessToken(options);
  }

  /**
   * login with username and password
   * @param options 
   */
  loginWithCredentials(options: LoginWithCredentialsRequest) {
    LoginService.loginWithCredentials(options);
  }

  /**
   * login with social
   * @param options 
   * @param queryParams 
   */
  loginWithSocial(options: SocialProviderPathParameter, queryParams?: SocialProviderQueryParameter) {
    LoginService.loginWithSocial(options, queryParams)
  }

  /**
   * register with social
   * @param options 
   * @param queryParams 
   */
  registerWithSocial(options: SocialProviderPathParameter, queryParams?: SocialProviderQueryParameter) {
    LoginService.registerWithSocial(options, queryParams)
  }

  /**
   * register user
   * @param options 
   * @param headers 
   * @returns 
   */
  register(options: RegisterRequest, headers: HTTPRequestHeader) {
    return UserService.register(options, headers);
  }

  /**
   * get invite info
   * @param options 
   * @returns 
   */
  getInviteUserDetails(options: GetInviteUserDetailsRequest) {
    return UserService.getInviteUserDetails(options);
  }

  /**
   * get Communication status
   * @param options
   * @returns 
   */
  getCommunicationStatus(options: getCommunicationStatusRequest, headers: HTTPRequestHeader) {
    return UserService.getCommunicationStatus(options, headers);
  }

  /**
   * initiate verification
   * @param options 
   * @returns 
   */
  initiateAccountVerification(options: InitiateAccountVerificationRequest) {
    VerificationService.initiateAccountVerification(options);
  }

  /**
   * verify account
   * @param options 
   * @returns 
   */
  verifyAccount(options: VerifyAccountRequest) {
    return VerificationService.verifyAccount(options)
  }

  /**
   * initiate reset password
   * @param options 
   * @returns 
   */
  initiateResetPassword(options: InitiateResetPasswordRequest) {
    return UserService.initiateResetPassword(options);
  }

  /**
   * handle reset password
   * @param options 
   */
  handleResetPassword(options: HandleResetPasswordRequest) {
    return UserService.handleResetPassword(options);
  }

  /**
  * reset password
  * @param options 
  */
  resetPassword(options: ResetPasswordRequest) {
    return UserService.resetPassword(options);
  }

  /**
   * get mfa list
   * @param options 
   * @returns 
   */
  getMFAList(options: GetMFAListRequest) {
    return VerificationService.getMFAList(options);
  }

  /**
   * cancel mfa
   * @param options 
   * @returns 
   */
  cancelMFA(options: CancelMFARequest) {
    return VerificationService.cancelMFA(options);
  }

  /** 
   * passwordless login
   * @param options 
   */
  passwordlessLogin(options: PasswordlessLoginRequest) {
    LoginService.passwordlessLogin(options);
  }

  /**
   * get user consent details
   * @param options 
   * @returns 
   */
  getConsentDetails(options: { consent_id: string; consent_version_id: string; sub: string; }) {
    return ConsentService.getConsentDetails(options);
  }

  /**
   * accept consent
   * @param options 
   * @returns 
   */
  acceptConsent(options: AcceptConsentRequest) {
    return ConsentService.acceptConsent(options);
  }

  /**
   * get scope consent details
   * @param options 
   * @returns 
   */
  loginPrecheck(options: { track_id: string; locale?: string; }) {
    return TokenService.loginPrecheck(options);
  }

  /**
   * get scope consent version details
   * @param options 
   * @returns 
   */
  getConsentVersionDetails(options: GetConsentVersionDetailsRequest) {
    return ConsentService.getConsentVersionDetails(options);
  }

  /**
   * accept scope Consent
   * @param options 
   * @returns 
   */
  acceptScopeConsent(options: AcceptScopeConsentRequest) {
    return ConsentService.acceptScopeConsent(options);
  }

  /**
   * accept claim Consent
   * @param options 
   * @returns 
   */
  acceptClaimConsent(options: AcceptClaimConsentRequest) {
    return ConsentService.acceptClaimConsent(options);
  }

  /**
   * revoke claim Consent
   * @param options 
   * @returns 
   */
  revokeClaimConsent(options: RevokeClaimConsentRequest) {
    return ConsentService.revokeClaimConsent(options);
  }

  /**
   * get Deduplication details
   * @param options 
   * @returns 
   */
  getDeduplicationDetails(options: GetDeduplicationDetailsRequest) {
    return UserService.getDeduplicationDetails(options);
  }

  /**
   * deduplication login
   * @param options 
   */
  deduplicationLogin(options: DeduplicationLoginRequest) {
    UserService.deduplicationLogin(options);
  }

  /**
   * register Deduplication
   * @param options 
   * @returns 
   */
  registerDeduplication(options: RegisterDeduplicationRequest) {
    return UserService.registerDeduplication(options);
  }

  /**
   * consent continue login
   * @param options 
   */
  consentContinue(options: LoginPrecheckRequest) {
    LoginService.consentContinue(options)
  }

  /**
   * mfa continue login
   * options: PhysicalVerificationLoginRequest is not needed anymore. It is now DEPRECATED and will be removed in the next major release
   * @param options 
   */
  mfaContinue(options: MfaContinueRequest) {
    LoginService.mfaContinue(options);
  }

  /**
   * change password continue
   * @param options 
   */
  firstTimeChangePassword(options: FirstTimeChangePasswordRequest) {
    LoginService.firstTimeChangePassword(options);
  }

  /**
   * change password
   * @param options 
   * @param access_token 
   * @returns 
   */
  changePassword(options: ChangePasswordRequest, access_token: string) {
    return UserService.changePassword(options, access_token);
  }


  /**
   * update profile
   * @param options 
   * @param access_token 
   * @param sub 
   * @returns 
   */
  updateProfile(options: CidaasUser, access_token: string, sub: string) {
    return UserService.updateProfile(options, access_token, sub);
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
   * const accessToken = 'your access token';
   * cidaas.getUserActivities(options, accessToken).then(function (resp) {
   *   // your success code
   * }).catch(function(ex) {
   *   // your failure code
   * });
   * ```
   */
  getUserActivities(options: IUserActivityPayloadEntity, accessToken: string) {
    const serviceURL = window.webAuthSettings.authority + '/activity-streams-srv/user-activities';
    return Helper.createHttpPromise(options, serviceURL, false, 'POST', accessToken);
  }

  /**
   * @param access_token 
   * @returns 
   */
  getAllVerificationList(access_token: string) {
    return VerificationService.getAllVerificationList(access_token);
  }

  /**
   * initiate link accoount
   * @param options 
   * @param access_token 
   * @returns 
   */
  initiateLinkAccount(options: InitiateLinkAccountRequest, access_token: string) {
    return UserService.initiateLinkAccount(options, access_token);
  }

  /**
   * complete link accoount
   * @param options 
   * @param access_token 
   * @returns 
   */
  completeLinkAccount(options: CompleteLinkAccountRequest, access_token: string) {
    return UserService.completeLinkAccount(options, access_token);
  }

  /**
   * get linked users
   * @param access_token 
   * @param sub 
   * @returns 
   */
  getLinkedUsers(access_token: string, sub: string) {
    return UserService.getLinkedUsers(access_token, sub)
  }

  /**
   * unlink accoount
   * @param access_token 
   * @param identityId 
   * @returns 
   */
  unlinkAccount(access_token: string, identityId: string) {
    return UserService.unlinkAccount(access_token, identityId);
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
   * const accessToken = 'your access token';
   * cidaas.updateProfileImage(options, accessToken).then(function (resp) {
   *   // your success code
   * }).catch(function(ex) {
   *   // your failure code
   * });
   * ```
   */
  updateProfileImage(options: { image_key: string, photo: Blob; filename: string }, access_token: string) {
    const serviceURL = window.webAuthSettings.authority + "/image-srv/profile/upload";

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

    return Helper.createHttpPromise(options, serviceURL, undefined, 'POST', access_token, null, formdata);

  }

  /**
   * enrollVerification
   * @param options 
   * @returns 
   */
  initiateEnrollment(options: InitiateEnrollmentRequest, accessToken: string) {
    return VerificationService.initiateEnrollment(options, accessToken);
  }

  /**
   * update the status of notification
   * @param status_id 
   * @returns 
   */
  getEnrollmentStatus(status_id: string, accessToken: string) {
    return VerificationService.getEnrollmentStatus(status_id, accessToken);
  }

  /**
   * enrollVerification
   * @param options 
   * @returns 
   */
    enrollVerification(options: EnrollVerificationRequest) {
      return VerificationService.enrollVerification(options);
    }

  /**
   * checkVerificationTypeConfigured
   * @param options 
   * @returns 
   */
  checkVerificationTypeConfigured(options: CheckVerificationTypeConfiguredRequest) {
    return VerificationService.checkVerificationTypeConfigured(options);
  }

  /**
   * deleteUserAccount
   * @param options 
   * @returns 
   */
  deleteUserAccount(options: DeleteUserAccountRequest) {
    return UserService.deleteUserAccount(options);
  }

  /**
   * getMissingFields
   * @param trackId - required. If only trackId is given, it will get missing fields from cidaas after succesfull registration using default provider
   * @param useSocialProvider - optional. If given, it will get missing fields from social provider after successful registration using social provider
   * 
   * @example
   * ```js
   * const trackId = 'your track id'
   * const useSocialProvider = {
   *   requestId: 'request id from cidaas'
   * };
   * cidaas.getMissingFields(trackId, useSocialProvider).then(function (resp) {
   *   // your success code
   * }).catch(function(ex) {
   *   // your failure code
   * });
   * ```
   * 
   */
  getMissingFields(trackId: string, useSocialProvider?: {requestId: string}) {
    if (useSocialProvider) {
      const _serviceURL = window.webAuthSettings.authority + "/public-srv/public/trackinfo/" + useSocialProvider.requestId + "/" + trackId;
      return Helper.createHttpPromise(undefined, _serviceURL,false, "GET");
    } else {
      return TokenService.getMissingFields(trackId);
    }
  }

  /**
   * progressiveRegistration
   * @param options 
   * @param headers 
   * @returns 
   */
  progressiveRegistration(options: CidaasUser, headers: ProgressiveRegistrationHeader) {
    return LoginService.progressiveRegistration(options, headers);
  }

  /**
   * loginAfterRegister
   * @param options
   */
  loginAfterRegister(options: LoginAfterRegisterRequest) {
    LoginService.loginAfterRegister(options);
  }

  /**
   * device code flow - initiate
   */
  initiateDeviceCode(clientId?: string) {
    return TokenService.initiateDeviceCode(clientId);
  }

  /**
   * device code flow - verify
   * @param code 
   */
  deviceCodeVerify(code: string) {
    TokenService.deviceCodeVerify(code);
  }

  /**
   * check if an user exists
   * @param options 
   * @returns 
   */
  userCheckExists(options: UserCheckExistsRequest) {
    return UserService.userCheckExists(options);
  }

  /**
   * To set accept language
   * @param acceptLanguage 
   */
  setAcceptLanguageHeader(acceptLanguage: string) {
    window.localeSettings = acceptLanguage;
  }

  /**
   * initiate mfa
   * @param options 
   * @returns 
   */
  initiateMFA(options: InitiateMFARequest, accessToken?: string) {
    // TODO: remove accessToken parameter in the next major release
    if (accessToken) {
      return VerificationService.initiateMFA(options, accessToken);
    } 
    return VerificationService.initiateMFA(options);
  }

  /**
   * authenticate mfa
   * @param options 
   * @returns 
   */
  authenticateMFA(options: AuthenticateMFARequest) {
    return VerificationService.authenticateMFA(options);
  }

  /**
   * offline token check
   */
  offlineTokenCheck(accessToken: string) {
    return TokenService.offlineTokenCheck(accessToken);
  }
}
