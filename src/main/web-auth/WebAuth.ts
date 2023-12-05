import { UserManager, UserManagerSettings } from "oidc-client-ts";

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
  FidoSetupEntity,
  IEnrollVerificationSetupRequestEntity,
  ISuggestedMFAActionConfig,
  IUserLinkEntity,
  UpdateReviewDeviceEntity,
  UserActivityEntity,
  ChangePasswordEntity,
  IConsentAcceptEntity,
  IAuthVerificationAuthenticationRequestEntity,
  FaceVerificationAuthenticationRequestEntity,
  LoginFormRequestEntity,
  AccountVerificationRequestEntity,
  ValidateResetPasswordEntity,
  AcceptResetPasswordEntity,
  LoginFormRequestAsyncEntity,
  PhysicalVerificationLoginRequest,
  IChangePasswordEntity,
  ICidaasSDKSettings
} from "./Entities"

export class WebAuth {

  constructor(settings: ICidaasSDKSettings) {
    try {
      if (!settings.response_type) {
        settings.response_type = "code";
      }
      if (!settings.scope) {
        settings.scope = "email openid profile mobile";
      }
      if (!settings.cidaas_version) {
        settings.cidaas_version = 2;
      }
      var usermanager = new UserManager(settings)
      window.webAuthSettings = settings;
      window.usermanager = usermanager;
      window.localeSettings = null;
      window.authentication = new Authentication(window.webAuthSettings, window.usermanager);
      window.usermanager.events.addSilentRenewError(function (error: any) {
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
    try {
      if (!window.webAuthSettings && !window.authentication) {
        throw new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
      }
      window.authentication.redirectSignIn('login');
    } catch (ex) {
      console.log(ex);
    }
  };

  /**
   * popupSignIn
   */
  popupSignIn() {
    try {
      if (!window.webAuthSettings && !window.authentication) {
        throw new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
      }
      window.authentication.popupSignIn();
    } catch (ex) {
      console.log(ex);
    }
  };

  /**
   * silentSignIn
   */
  silentSignIn() {

    return new Promise((resolve, reject) => {
      try {
        if (!window.webAuthSettings && !window.authentication) {
          throw new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
        }
        window.authentication.silentSignIn().then(function (user: any) {
          resolve(user);
        }).catch(function (ex: any) {
          reject(ex);
        });
      } catch (ex) {
        console.log(ex);
      }
    });
  };

  /**
   * register
   */
  registerWithBrowser() {
    try {
      if (!window.webAuthSettings && !window.authentication) {
        throw new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
      }
      window.authentication.redirectSignIn('register');
    } catch (ex) {
      console.log(ex);
    }
  };

  /**
   * login callback
   * @returns 
   */
  loginCallback() {
    return new Promise((resolve, reject) => {
      try {
        if (!window.webAuthSettings && !window.authentication) {
          throw new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
        }
        window.authentication.redirectSignInCallback().then(function (user: any) {
          resolve(user);
        }).catch(function (ex: any) {
          reject(ex);
        });
      } catch (ex) {
        console.log(ex);
      }
    });
  };

  /**
   * popup signin callback
   * @returns 
   */
  popupSignInCallback() {
    return new Promise((resolve, reject) => {
      try {
        if (!window.webAuthSettings && !window.authentication) {
          throw new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
        }
        window.authentication.popupSignInCallback();
      } catch (ex) {
        console.log(ex);
      }
    });
  };

  /**
   * silent signin callback
   * @returns 
   */
  silentSignInCallback() {
    return new Promise((resolve, reject) => {
      try {
        if (!window.webAuthSettings && !window.authentication) {
          throw new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
        }
        window.authentication.silentSignInCallback().then(function (data: any) {
          resolve(data);
        }).catch(function (error: any) {
          reject(error);
        })
      } catch (ex) {
        console.log(ex);
      }
    });
  };

  /**
   * get user info
   * @returns 
   */
  async getUserInfo() {
    try {
      if (window.usermanager) {
        return await window.usermanager.getUser();
      } else {
        throw new CustomException("UserManager cannot be empty", 417);
      }
    } catch (e) {
      throw e
    }
  };


  /**
   * logout
   * @returns 
   */
  logout() {
    return new Promise((resolve, reject) => {
      try {
        if (!window.webAuthSettings && !window.authentication) {
          throw new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
        }
        window.authentication.redirectSignOut().then(function (result: any) {
          resolve(result);
          return;
        });
      } catch (ex) {
        reject(ex);
      }
    });
  };

  /**
   * popup signout
   * @returns 
   */
  popupSignOut() {
    return new Promise((resolve, reject) => {
      try {
        if (!window.webAuthSettings && !window.authentication) {
          throw new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
        }
        window.authentication.popupSignOut();
      } catch (ex) {
        reject(ex);
      }
    });
  };

  /**
   * logout callback
   * @returns 
   */
  logoutCallback() {
    return new Promise((resolve, reject) => {
      try {
        if (!window.webAuthSettings && !window.authentication) {
          throw new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
        }
        window.authentication.redirectSignOutCallback().then(function (resp: any) {
          resolve(resp);
        });
      } catch (ex) {
        reject(ex);
      }
    });
  };

  /**
   * popup signout callback
   * @returns 
   */
  popupSignOutCallback() {
    return new Promise((resolve, reject) => {
      try {
        if (!window.webAuthSettings && !window.authentication) {
          throw new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
        }
        window.authentication.popupSignOutCallback();
      } catch (ex) {
        reject(ex);
      }
    });
  };  

  /**
   * get login url
   * @returns 
   */
  getLoginURL() {
    let loginUrl: string;
    let finish: boolean = false;
    (async () => {
      try {
        loginUrl = await window.usermanager._client.getSignInRedirectUrl();
      }
      catch (e) {
        //TODO: define Error handling
        console.log(e);
      }
      finish = true
    })();
    while (!finish) { } // A simple synchronous loop to wait async call is finish
    return loginUrl;
  };

  /**
   * get request id
   * @returns 
   */
  getRequestId() {
    return new Promise((resolve, reject) => {
      try {
        var respone_type = window.webAuthSettings.response_type;
        if (!respone_type) {
          respone_type = "token";
        }
        var response_mode = window.webAuthSettings.response_mode;
        if (!response_mode) {
          response_mode = "fragment";
        }
        var bodyParams = {
          "client_id": window.webAuthSettings.client_id,
          "redirect_uri": window.webAuthSettings.redirect_uri,
          "response_type": respone_type,
          "response_mode": response_mode,
          "scope": window.webAuthSettings.scope,
          "nonce": new Date().getTime().toString()
        };
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/authz-srv/authrequest/authz/generate";
        http.onreadystatechange = function () {
          if (http.readyState == 4) {
            if (http.responseText) {
              resolve(JSON.parse(http.responseText));
            } else {
              resolve(false);
            }
          }
        };
        http.open("POST", _serviceURL, true);
        http.setRequestHeader("Content-type", "application/json");
        if (window.localeSettings) {
          http.setRequestHeader("accept-language", window.localeSettings);
        }
        http.send(JSON.stringify(bodyParams));
      } catch (ex) {
        reject(ex);
      }
    });
  };

  /**
   * get missing fields
   * @param options 
   * @returns 
   */
  getMissingFields(options: { requestId: string; trackId: string; }) {
    const _serviceURL = window.webAuthSettings.authority + "/public-srv/public/trackinfo/" + options.requestId + "/" + options.trackId;
    return Helper.createHttpPromise(undefined, _serviceURL,false, "GET");
  };

  /**
   * get Tenant info
   * @returns 
   */
  getTenantInfo() {
    const _serviceURL = window.webAuthSettings.authority + "/public-srv/tenantinfo/basic";
    return Helper.createHttpPromise(undefined, _serviceURL,false, "GET");
  };

  /**
   * logout api call
   * @param options 
   */
  logoutUser(options: { access_token: string }) {
    try {
      window.location.href = window.webAuthSettings.authority + "/session/end_session?access_token_hint=" + options.access_token + "&post_logout_redirect_uri=" + window.webAuthSettings.post_logout_redirect_uri;
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * get Client Info
   * @param options 
   * @returns 
   */
  getClientInfo(options: { requestId: string }) {
    const _serviceURL = window.webAuthSettings.authority + "/public-srv/public/" + options.requestId;
    return Helper.createHttpPromise(undefined, _serviceURL,false, "GET");
  };

  /**
   * get all devices associated to the client
   * @param options 
   * @returns 
   */
  getDevicesInfo(options: any) {
    options.userAgent = window.navigator.userAgent;
    const _serviceURL = window.webAuthSettings.authority + "/device-srv/devices";
    if (window.navigator.userAgent) {
      return Helper.createHttpPromise(options, _serviceURL,false, "GET");
    }
    return Helper.createHttpPromise(undefined, _serviceURL,false, "GET");
  };

  /**
   * delete a device
   * @param options 
   * @returns 
   */
  deleteDevice(options: { device_id: string; userAgent?: string }) {
    const _serviceURL = window.webAuthSettings.authority + "/device-srv/device/" + options.device_id;
    options.userAgent = window.navigator.userAgent;
    if (window.navigator.userAgent) {
      return Helper.createHttpPromise(options, _serviceURL,false, "DELETE");
    }
    return Helper.createHttpPromise(undefined, _serviceURL,false, "DELETE");
  };

  /**
   * get Registration setup
   * @param options 
   * @returns 
   */
  getRegistrationSetup(options: { acceptlanguage: string; requestId: string }) {
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/registration-setup-srv/public/list?acceptlanguage=" + options.acceptlanguage + "&requestId=" + options.requestId;
        http.onreadystatechange = function () {
          if (http.readyState == 4) {
            if (http.responseText) {
              var parsedResponse = JSON.parse(http.responseText);
              if (parsedResponse && parsedResponse.data && parsedResponse.data.length > 0) {
                let registrationFields = parsedResponse.data;
              }
              resolve(parsedResponse);
            } else {
              resolve(false);
            }
          }
        };
        http.open("GET", _serviceURL, true);
        http.setRequestHeader("Content-type", "application/json");
        if (window.localeSettings) {
          http.setRequestHeader("accept-language", window.localeSettings);
        }
        http.send();
      } catch (ex) {
        reject(ex);
      }
    });
  };

  /**
 * get unreviewed devices
 * @param access_token 
 * @param sub 
 * @returns 
 */
  getUnreviewedDevices(access_token: string, sub: string) {
    let _serviceURL = window.webAuthSettings.authority + "/reports-srv/device/unreviewlist/" + sub;
    return Helper.createHttpPromise(undefined, _serviceURL,false, "GET", access_token);
  };

  /**
   * get reviewed devices
   * @param access_token 
   * @param sub 
   * @returns 
   */
  getReviewedDevices(access_token: string, sub: string) {
    let _serviceURL = window.webAuthSettings.authority + "/reports-srv/device/reviewlist/" + sub;
    return Helper.createHttpPromise(undefined, _serviceURL,false, "GET", access_token);
  };

  /**
   * review device
   * @param options 
   * @param access_token 
   * @returns 
   */
  reviewDevice(options: UpdateReviewDeviceEntity, access_token: string) {
    let _serviceURL = window.webAuthSettings.authority + "/reports-srv/device/updatereview";
    return Helper.createHttpPromise(options, _serviceURL,false, "PUT", access_token);
  };

  /**
   * get device info
   * @returns 
   */
  getDeviceInfo() {
    return new Promise((resolve, reject) => {
      try {
        var value = ('; ' + document.cookie).split(`; cidaas_dr=`).pop().split(';')[0];
        var options = { userAgent: "" };
        if (!value) {
          (async () => {
            options.userAgent = window.navigator.userAgent
            var http = new XMLHttpRequest();
            var _serviceURL = window.webAuthSettings.authority + "/device-srv/deviceinfo";
            http.onreadystatechange = function () {
              if (http.readyState == 4) {
                resolve(JSON.parse(http.responseText));
              }
            };
            http.open("POST", _serviceURL, true);
            http.setRequestHeader("Content-type", "application/json");
            if (window.localeSettings) {
              http.setRequestHeader("accept-language", window.localeSettings);
            }
            http.send(JSON.stringify(options));
          })();
        }
      } catch (ex) {
        reject(ex);
      }
    });
  };

  /**
   * To get the user profile information, call getUserProfile(). The function accepts a function parameter of type object. In the sample example the object is named as options. Below are the key that need to be passed in the options object
   * 
   * @param options - contains access_token property.
   * 
   * @returns user profile
   * 
   * @example
   * ```
   * let options = {
   *   access_token: YOUR_ACCESS_TOKEN,
   * }
   * cidaas.getUserProfile(options)
   * .then(function (response) {
   *   // the response will give you user profile information.
   * }).catch(function (ex) {
   *   // your failure code here
   * });
   * ```
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
  getInviteUserDetails(options: { invite_id: string }) {
    return UserService.getInviteUserDetails(options);
  };

  /**
   * get Communication status
   * @param options 
   * @returns 
   */
  getCommunicationStatus(options: { sub: string, requestId: string }) {
    return UserService.getCommunicationStatus(options);
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
  getScopeConsentDetails(options: { track_id: string; locale: string; }) {
    return TokenService.getScopeConsentDetails(options);
  };

  /**
   * get scope consent version details
   * @param options 
   * @returns 
   */
  getScopeConsentVersionDetails(options: { scopeid: string; locale: string; access_token: string; }) {
    return ConsentService.getScopeConsentVersionDetails(options);
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
   * get user activities
   * @param options 
   * @param access_token 
   * @returns 
   */
  getUserActivities(options: UserActivityEntity, access_token: string) {
    var _serviceURL = window.webAuthSettings.authority + "/useractivity-srv/latestactivity";
    return Helper.createHttpPromise(options, _serviceURL, false,"POST", access_token);
  };

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
   * image upload
   * @param options 
   * @param access_token 
   * @returns 
   */
  updateProfileImage(options: { image_key: string; }, access_token: string) {
    var _serviceURL = window.webAuthSettings.authority + "/image-srv/profile/upload";
    return Helper.createHttpPromise(options, _serviceURL, false,"POST", access_token);
  };

  /**
   * enrollVerification
   * @param options 
   * @returns 
   */
  initiateEnrollment(options: {
    verification_type: string,
    deviceInfo: {
      deviceId: "", 
      location: {lat: "", lon: ""}
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
   * getMissingFieldsLogin
   * @param trackId 
   * @returns 
   */
  getMissingFieldsLogin(trackId: string) {
    return TokenService.getMissingFieldsLogin(trackId);
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
  initiateMFA(options: IInitVerificationAuthenticationRequestEntity, accessToken: string) {
    return VerificationService.initiateMFA(options, accessToken);
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
