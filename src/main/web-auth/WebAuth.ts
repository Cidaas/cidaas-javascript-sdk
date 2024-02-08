import { SigninRequest, SigninState, UserManager, UserManagerSettings } from "oidc-client-ts";

import { Authentication } from "../authentication";
import { Helper, CustomException } from "./Helper";
import { LoginService } from "./LoginService";
import { UserService } from "./UserService";
import { TokenService } from "./TokenService";
import { VerificationService } from "./VerificationService";
import { ConsentService } from "./ConsentService";

import {
  AccessTokenRequest,
  TokenIntrospectionEntity,
  UserEntity,
  ResetPasswordEntity,
  IConfiguredListRequestEntity,
  IInitVerificationAuthenticationRequestEntity,
  FindUserEntity,
  IUserEntity,
  IEnrollVerificationSetupRequestEntity,
  IUserLinkEntity,
  ChangePasswordEntity,
  IConsentAcceptEntity,
  IAuthVerificationAuthenticationRequestEntity,
  LoginFormRequestEntity,
  AccountVerificationRequestEntity,
  ValidateResetPasswordEntity,
  AcceptResetPasswordEntity,
  PhysicalVerificationLoginRequest,
  IChangePasswordEntity,
  IUserActivityPayloadEntity,
} from "./Entities"

export const createPreloginWebauth = (authority: string) => {
  return new WebAuth({'authority': authority} as UserManagerSettings);
}

export class WebAuth {

  constructor(settings: UserManagerSettings) {
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
      var usermanager = new UserManager(settings);
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
   * login
   */
  loginWithBrowser() {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.loginOrRegisterWithBrowser('login');  
  };

  /**
   * popupSignIn
   */
  popupSignIn() {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.popupSignIn();
  };

  /**
   * silentSignIn
   */
  silentSignIn() {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.silentSignIn();
  };

  /**
   * register
   */
  registerWithBrowser() {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.loginOrRegisterWithBrowser('register');
  };

  /**
   * login callback
   * @returns 
   */
  loginCallback() {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.loginCallback();
  };

  /**
   * popup signin callback
   * @returns 
   */
  popupSignInCallback() {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.popupSignInCallback();
  };

  /**
   * silent signin callback
   * @returns 
   */
  silentSignInCallback() {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.silentSignInCallback();
  };

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
   */
  async getUserInfo() {
    if (!window.usermanager) {
      return Promise.reject(new CustomException("UserManager cannot be empty", 417));
    }
    return await window.usermanager.getUser();
  };

  /**
   * logout by using oidc-client-ts library
   * @returns 
   */
  logout() {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.logout();
  };

  /**
   * popup signout
   * @returns 
   */
  popupSignOut() {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.popupSignOut();
  };

  /**
   * logout callback
   * @returns 
   */
  logoutCallback() {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.logoutCallback();
  };

  /**
   * popup signout callback
   * @returns 
   */
  popupSignOutCallback() {
    if (!window.webAuthSettings || !window.authentication) {
      return Promise.reject(new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417));
    }
    return window.authentication.popupSignOutCallback();
  };  

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
   */
  getLoginURL(state?: SigninState) {
    return new Promise((resolve, reject) => {
      try {
        window.usermanager._client.createSigninRequest({state:state}).then((signinRequest: SigninRequest) => {
          resolve(signinRequest.url);
        }); 
      } catch (e) {
        reject(e);
      }
    });
  };

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
  };

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
  };

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
  logoutUser(options: { access_token: string }) {
    try {
      window.location.href = window.webAuthSettings.authority + "/session/end_session?access_token_hint=" + options.access_token + "&post_logout_redirect_uri=" + window.webAuthSettings.post_logout_redirect_uri;
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

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
  getClientInfo(options: { requestId: string }) {
    const _serviceURL = window.webAuthSettings.authority + "/public-srv/public/" + options.requestId;
    return Helper.createHttpPromise(undefined, _serviceURL,false, "GET");
  };

  /**
   * To get all devices information associated to the client, call **getDevicesInfo()**
   * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/2a2feed70303c-get-device-by-user for more details.
   * @example
   * ```js
   * const options = {};
   * const accessToken = 'your access token';
   * cidaas.getDevicesInfo(options, accessToken).then(function (resp) {
   *   // the response will give you devices informations.
   * }).catch(function(ex) {
   *   // your failure code here
   * });
   * ```
   */
  getDevicesInfo(options: any, accessToken: string) {
    options.userAgent = window.navigator.userAgent;
    const _serviceURL = window.webAuthSettings.authority + "/device-srv/devices";
    if (window.navigator.userAgent) {
      return Helper.createHttpPromise(options, _serviceURL,false, "GET", accessToken);
    }
    return Helper.createHttpPromise(undefined, _serviceURL,false, "GET", accessToken);
  };

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
  };

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
  };

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
  };

  /**
   * get the user profile information
   * @param options 
   * @returns 
   */
  getUserProfile(options: { access_token: string }) {
    return UserService.getUserProfile(options);
  };

  /**
   * renew token using refresh token
   * @param options 
   * @returns 
   */
  renewToken(options: AccessTokenRequest) {
    return TokenService.renewToken(options);
  };

  /**
   * get access token from code
   * @param options 
   * @returns 
   */
  getAccessToken(options: AccessTokenRequest) {
    return TokenService.getAccessToken(options);
  };

  /**
   * validate access token
   * @param options 
   * @returns 
   */
  validateAccessToken(options: TokenIntrospectionEntity) {
    return TokenService.validateAccessToken(options);
  };

  /**
   * login with username and password
   * @param options 
   */
  loginWithCredentials(options: LoginFormRequestEntity) {
    LoginService.loginWithCredentials(options);
  };

  /**
   * login with social
   * @param options 
   * @param queryParams 
   */
  loginWithSocial(options: { provider: string; requestId: string; }, queryParams: { dc: string; device_fp: string }) {
    LoginService.loginWithSocial(options, queryParams)
  };

  /**
   * register with social
   * @param options 
   * @param queryParams 
   */
  registerWithSocial(options: { provider: string; requestId: string; }, queryParams: { dc: string; device_fp: string }) {
    LoginService.registerWithSocial(options, queryParams)
  };

  /**
   * register user
   * @param options 
   * @param headers 
   * @returns 
   */
  register(options: UserEntity, headers: { requestId: string; captcha?: string; acceptlanguage?: string; bot_captcha_response?: string; trackId?: string; }) {
    return UserService.register(options, headers);
  };

  /**
   * get invite info
   * @param options 
   * @returns 
   */
  getInviteUserDetails(options: { invite_id: string, callLatestAPI?: boolean }) {
    return UserService.getInviteUserDetails(options);
  };

  /**
   * get Communication status
   * @param options 
   * @returns 
   */
  getCommunicationStatus(options: { sub: string }, headers: {requestId: string }) {
    return UserService.getCommunicationStatus(options, headers);
  };

  /**
   * initiate verification
   * @param options 
   * @returns 
   */
  initiateAccountVerification(options: AccountVerificationRequestEntity) {
    VerificationService.initiateAccountVerification(options);
  };

  /**
   * verify account
   * @param options 
   * @returns 
   */
  verifyAccount(options: { accvid: string; code: string; }) {
    return VerificationService.verifyAccount(options)
  };

  /**
   * initiate reset password
   * @param options 
   * @returns 
   */
  initiateResetPassword(options: ResetPasswordEntity) {
    return UserService.initiateResetPassword(options);
  };

  /**
   * handle reset password
   * @param options 
   */
  handleResetPassword(options: ValidateResetPasswordEntity) {
    return UserService.handleResetPassword(options);
  };

  /**
  * reset password
  * @param options 
  */
  resetPassword(options: AcceptResetPasswordEntity) {
    return UserService.resetPassword(options);
  };

  /**
   * get mfa list
   * @param options 
   * @returns 
   */
  getMFAList(options: IConfiguredListRequestEntity) {
    return VerificationService.getMFAList(options);
  };

  /**
   * cancel mfa
   * @param options 
   * @returns 
   */
  cancelMFA(options: { exchange_id: string; reason: string; type: string; }) {
    return VerificationService.cancelMFA(options);
  };

  /** 
   * passwordless login
   * @param options 
   */
  passwordlessLogin(options: PhysicalVerificationLoginRequest) {
    LoginService.passwordlessLogin(options);
  };

  /**
   * get user consent details
   * @param options 
   * @returns 
   */
  getConsentDetails(options: { consent_id: string; consent_version_id: string; sub: string; }) {
    return ConsentService.getConsentDetails(options);
  };

  /**
   * accept consent
   * @param options 
   * @returns 
   */
  acceptConsent(options: IConsentAcceptEntity) {
    return ConsentService.acceptConsent(options);
  };

  /**
   * get scope consent details
   * @param options 
   * @returns 
   */
  loginPrecheck(options: { track_id: string; locale: string; }) {
    return TokenService.loginPrecheck(options);
  };

  /**
   * get scope consent version details
   * @param options 
   * @returns 
   */
  getConsentVersionDetails(options: { consentid: string; locale: string; access_token: string; }) {
    return ConsentService.getConsentVersionDetails(options);
  };

  /**
   * accept scope Consent
   * @param options 
   * @returns 
   */
  acceptScopeConsent(options: { client_id: string; sub: string; scopes: string[]; }) {
    return ConsentService.acceptScopeConsent(options);
  };

  /**
   * accept claim Consent
   * @param options 
   * @returns 
   */
  acceptClaimConsent(options: { client_id: string; sub: string; accepted_claims: string[]; }) {
    return ConsentService.acceptClaimConsent(options);
  };

  /**
   * revoke claim Consent
   * @param options 
   * @returns 
   */
  revokeClaimConsent(options: { client_id: string; sub: string; revoked_claims: string[]; }) {
    return ConsentService.revokeClaimConsent(options);
  };

  /**
   * get Deduplication details
   * @param options 
   * @returns 
   */
  getDeduplicationDetails(options: { trackId: string }) {
    return UserService.getDeduplicationDetails(options);
  };

  /**
   * deduplication login
   * @param options 
   */
  deduplicationLogin(options: { trackId: string, requestId: string, sub: string }) {
    UserService.deduplicationLogin(options);
  };

  /**
   * register Deduplication
   * @param options 
   * @returns 
   */
  registerDeduplication(options: { trackId: string }) {
    return UserService.registerDeduplication(options);
  };

  /**
   * accepts any as the request
   * consent continue login
   * @param options 
   */
  consentContinue(options: {
    client_id: string;
    consent_refs: string[];
    sub: string;
    scopes: string[];
    matcher: any;
    track_id: string;
  }) {
    LoginService.consentContinue(options)
  };

  /**
   * mfa continue login
   * @param options 
   */
  mfaContinue(options: PhysicalVerificationLoginRequest & { track_id: string }) {
    LoginService.mfaContinue(options);
  };

  /**
   * change password continue
   * @param options 
   */
  firstTimeChangePassword(options: IChangePasswordEntity) {
    LoginService.firstTimeChangePassword(options);
  };

  /**
   * change password
   * @param options 
   * @param access_token 
   * @returns 
   */
  changePassword(options: ChangePasswordEntity, access_token: string) {
    return UserService.changePassword(options, access_token);
  };


  /**
   * update profile
   * @param options 
   * @param access_token 
   * @param sub 
   * @returns 
   */
  updateProfile(options: UserEntity, access_token: string, sub: string) {
    return UserService.updateProfile(options, access_token, sub);
  };

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
  };

  /**
   * initiate link accoount
   * @param options 
   * @param access_token 
   * @returns 
   */
  initiateLinkAccount(options: IUserLinkEntity, access_token: string) {
    return UserService.initiateLinkAccount(options, access_token);
  };

  /**
   * complete link accoount
   * @param options 
   * @param access_token 
   * @returns 
   */
  completeLinkAccount(options: { code?: string; link_request_id?: string; }, access_token: string) {
    return UserService.completeLinkAccount(options, access_token);
  };

  /**
   * get linked users
   * @param access_token 
   * @param sub 
   * @returns 
   */
  getLinkedUsers(access_token: string, sub: string) {
    return UserService.getLinkedUsers(access_token, sub)
  };

  /**
   * unlink accoount
   * @param access_token 
   * @param identityId 
   * @returns 
   */
  unlinkAccount(access_token: string, identityId: string) {
    return UserService.unlinkAccount(access_token, identityId);
  };

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
  updateProfileImage(options: { image_key: string, photo: any; filename: string }, access_token: string) {
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

  };

  /**
   * enrollVerification
   * @param options 
   * @returns 
   */
  initiateEnrollment(options: {
    verification_type: string,
    deviceInfo?: {
      deviceId: string, 
      location: {lat: string, lon: string}
    }
  }, accessToken: string) {
    return VerificationService.initiateEnrollment(options, accessToken);
  };

  /**
   * update the status of notification
   * @param status_id 
   * @returns 
   */
  getEnrollmentStatus(status_id: string, accessToken: string) {
    return VerificationService.getEnrollmentStatus(status_id, accessToken);
  };

  /**
   * enrollVerification
   * @param options 
   * @returns 
   */
    enrollVerification(options: IEnrollVerificationSetupRequestEntity) {
      return VerificationService.enrollVerification(options);
    };

  /**
   * checkVerificationTypeConfigured
   * @param options 
   * @returns 
   */
  checkVerificationTypeConfigured(options: IConfiguredListRequestEntity) {
    return VerificationService.checkVerificationTypeConfigured(options);
  };

  /**
   * deleteUserAccount
   * @param options 
   * @returns 
   */
  deleteUserAccount(options: { access_token: string, sub: string }) {
    return UserService.deleteUserAccount(options);
  };

  /**
   * getMissingFields
   * @param trackId 
   * @returns 
   */
  getMissingFields(trackId: string) {
    return TokenService.getMissingFields(trackId);
  };

  /**
   * progressiveRegistration
   * @param options 
   * @param headers 
   * @returns 
   */
  progressiveRegistration(options: IUserEntity, headers: { requestId: string; trackId: string; acceptlanguage: string; }) {
    return LoginService.progressiveRegistration(options, headers);
  };

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
  userCheckExists(options: FindUserEntity) {
    return UserService.userCheckExists(options);
  };

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
  initiateMFA(options: IInitVerificationAuthenticationRequestEntity, accessToken?: string) {
    // TODO: remove accessToken parameter in the next major release
    if (accessToken) {
      return VerificationService.initiateMFA(options, accessToken);
    } 
    return VerificationService.initiateMFA(options);
  };

  /**
   * authenticate mfa
   * @param options 
   * @returns 
   */
  authenticateMFA(options: IAuthVerificationAuthenticationRequestEntity) {
    return VerificationService.authenticateMFA(options);
  };

  /**
   * offline token check
   */
  offlineTokenCheck(accessToken: string) {
    return TokenService.offlineTokenCheck(accessToken);
  };
}
