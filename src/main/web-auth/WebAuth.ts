import { UserManager, UserManagerSettings } from "oidc-client-ts";
import * as CryptoJS from 'crypto-js';

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
  IChangePasswordEntity
} from "./Entities"

export class WebAuth {

  constructor(settings: UserManagerSettings & { mode?: string, cidaas_version: number }) {
    try {
      var usermanager = new UserManager(settings)
      window.webAuthSettings = settings;
      window.usermanager = usermanager;
      window.localeSettings = null;
      window.authentication = new Authentication(window.webAuthSettings, window.usermanager);
      window.usermanager.events.addSilentRenewError(function (error: any) {
        throw new CustomException("Error while renewing silent login", 500);
      });
      if (!settings.mode) {
        window.webAuthSettings.mode = 'redirect';
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  /**
 * @param string 
 * @returns 
 */
  private base64URL(string: any) {
    return string.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  };

  // prototype methods 
  /**
   * login
   */
  loginWithBrowser() {
    try {
      if (!window.webAuthSettings && !window.authentication) {
        throw new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
      }
      switch (window.webAuthSettings.mode) {
        case 'redirect':
          window.authentication.redirectSignIn('login');
          break;
        case 'window':
          window.authentication.popupSignIn();
          break;
        case 'silent':
          window.authentication.silentSignIn();
          break;
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  /**
   * register
   */
  registerWithBrowser() {
    try {
      if (!window.webAuthSettings && !window.authentication) {
        throw new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
      }
      switch (window.webAuthSettings.mode) {
        case 'redirect':
          window.authentication.redirectSignIn('register');
          break;
        case 'window':
          window.authentication.popupSignIn();
          break;
        case 'silent':
          window.authentication.silentSignIn();
          break;
      }
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
        switch (window.webAuthSettings.mode) {
          case 'redirect':
            window.authentication.redirectSignInCallback().then(function (user: any) {
              resolve(user);
            }).catch(function (ex: any) {
              reject(ex);
            });
            break;
          case 'window':
            window.authentication.popupSignInCallback();
            break;
          case 'silent':
            window.authentication.silentSignInCallbackV2().then(function (data: any) {
              resolve(data);
            }).catch(function (error: any) {
              reject(error);
            })
            break;
        }
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
        if (window.webAuthSettings.mode == 'redirect') {
          window.authentication.redirectSignOut().then(function (result: any) {
            resolve(result);
            return;
          });
        } else if (window.webAuthSettings.mode == 'window') {
          window.authentication.popupSignOut();
        } else if (window.webAuthSettings.mode == 'silent') {
          window.authentication.redirectSignOut();
        } else {
          resolve(undefined);
        }
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
        if (window.webAuthSettings.mode == 'redirect') {
          window.authentication.redirectSignOutCallback().then(function (resp: any) {
            resolve(resp);
          });
        } else if (window.webAuthSettings.mode == 'window') {
          window.authentication.popupSignOutCallback();
        } else if (window.webAuthSettings.mode == 'silent') {
          window.authentication.redirectSignOutCallback();
        }
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
    var settings = window.webAuthSettings;
    if (!settings.response_type) {
      settings.response_type = "code";
    }
    if (!settings.scope) {
      settings.scope = "email openid profile mobile";
    }
    var loginURL = "";
    window.usermanager._client.createSigninRequest(settings).then((signInRequest: any) => {
      loginURL = signInRequest.url;
    }) 
    var timeRemaining = 5000
    while(timeRemaining > 0) {
      if (loginURL) {
        break;
      }
      setTimeout(() => {
        timeRemaining -= 100
      }, 100);
    }
    return loginURL;
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
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/public-srv/public/trackinfo/" + options.requestId + "/" + options.trackId;
        http.onreadystatechange = function () {
          if (http.readyState == 4) {
            if (http.responseText) {
              resolve(JSON.parse(http.responseText));
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
   * get Tenant info
   * @returns 
   */
  getTenantInfo() {
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/public-srv/tenantinfo/basic";
        http.onreadystatechange = function () {
          if (http.readyState == 4) {
            if (http.responseText) {
              resolve(JSON.parse(http.responseText));
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
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/public-srv/public/" + options.requestId;
        http.onreadystatechange = function () {
          if (http.readyState == 4) {
            if (http.responseText) {
              resolve(JSON.parse(http.responseText));
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
   * get all devices associated to the client
   * @param options 
   * @returns 
   */
  getDevicesInfo(options: any) {
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/device-srv/devices";
        options.userAgent = window.navigator.userAgent
        http.onreadystatechange = function () {
          if (http.readyState == 4) {
            if (http.responseText) {
              resolve(JSON.parse(http.responseText));
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
        if (window.navigator.userAgent) {
          http.send(JSON.stringify(options));
        }
        http.send();
      } catch (ex) {
        reject(ex);
      }
    });
  };

  /**
   * delete a device
   * @param options 
   * @returns 
   */
  deleteDevice(options: { device_id: string; userAgent?: string }) {
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/device-srv/device/" + options.device_id;
        options.userAgent = window.navigator.userAgent
        http.onreadystatechange = function () {
          if (http.readyState == 4) {
            if (http.responseText) {
              resolve(JSON.parse(http.responseText));
            } else {
              resolve(false);
            }
          }
        };
        http.open("DELETE", _serviceURL, true);
        http.setRequestHeader("Content-type", "application/json");
        if (window.localeSettings) {
          http.setRequestHeader("accept-language", window.localeSettings);
        }
        if (window.navigator.userAgent) {
          http.send(JSON.stringify(options));
        }
        http.send();
      } catch (ex) {
        reject(ex);
      }
    });
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
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/reports-srv/device/unreviewlist/" + sub;
        http.onreadystatechange = function () {
          if (http.readyState == 4) {
            if (http.responseText) {
              resolve(JSON.parse(http.responseText));
            } else {
              resolve(false);
            }
          }
        };
        http.open("GET", _serviceURL, true);
        http.setRequestHeader("Content-type", "application/json");
        http.setRequestHeader("Authorization", `Bearer ${access_token}`);
        if (window.localeSettings) {
          http.setRequestHeader("accept-language", window.localeSettings);
        }
        http.send();
      } catch (ex) {
        throw new CustomException(ex, 417);
      }
    });
  };

  /**
   * get reviewed devices
   * @param access_token 
   * @param sub 
   * @returns 
   */
  getReviewedDevices(access_token: string, sub: string) {
    return new Promise(function (resolve, reject) {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/reports-srv/device/reviewlist/" + sub;
        http.onreadystatechange = function () {
          if (http.readyState == 4) {
            if (http.responseText) {
              resolve(JSON.parse(http.responseText));
            } else {
              resolve(false);
            }
          }
        };
        http.open("GET", _serviceURL, true);
        http.setRequestHeader("Content-type", "application/json");
        http.setRequestHeader("Authorization", `Bearer ${access_token}`);
        if (window.localeSettings) {
          http.setRequestHeader("accept-language", window.localeSettings);
        }
        http.send();
      } catch (ex) {
        throw new CustomException(ex, 417);
      }
    });
  };

  /**
   * review device
   * @param options 
   * @param access_token 
   * @returns 
   */
  reviewDevice(options: UpdateReviewDeviceEntity, access_token: string) {
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/reports-srv/device/updatereview";
        http.onreadystatechange = function () {
          if (http.readyState == 4) {
            if (http.responseText) {
              resolve(JSON.parse(http.responseText));
            } else {
              resolve(false);
            }
          }
        };
        http.open("PUT", _serviceURL, true);
        http.setRequestHeader("Content-type", "application/json");
        http.setRequestHeader("Authorization", `Bearer ${access_token}`);
        if (window.localeSettings) {
          http.setRequestHeader("accept-language", window.localeSettings);
        }
        http.send(JSON.stringify(options));
      } catch (ex) {
        throw new CustomException(ex, 417);
      }
    });
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
  * get user info
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
   * login with username and password and return response
   * @param options 
   * @returns 
   */
  async loginWithCredentialsAsynFn(options: LoginFormRequestAsyncEntity) {
    await LoginService.loginWithCredentialsAsynFn(options);
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
   * initiate verification and return response
   * @param options 
   * @returns 
   */
  async initiateAccountVerificationAsynFn(options: AccountVerificationRequestEntity) {
    return await VerificationService.initiateAccountVerificationAsynFn(options);
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
   * get mfa list v2
   * @param options 
   * @returns 
   */
  getMFAListV2(options: IConfiguredListRequestEntity) {
    return VerificationService.getMFAListV2(options);
  };

  /**
   * cancel mfa v2
   * @param options 
   * @returns 
   */
  cancelMFAV2(options: { exchange_id: string; reason: string; type: string; }) {
    return VerificationService.cancelMFAV2(options);
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
  getConsentDetailsV2(options: { consent_id: string; consent_version_id: string; sub: string; }) {
    return ConsentService.getConsentDetailsV2(options);
  };

  /**
   * accept consent v2
   * @param options 
   * @returns 
   */
  acceptConsentV2(options: IConsentAcceptEntity) {
    return ConsentService.acceptConsentV2(options);
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
  getScopeConsentVersionDetailsV2(options: { scopeid: string; locale: string; access_token: string; }) {
    return ConsentService.getScopeConsentVersionDetailsV2(options);
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
   * scope consent continue login
   * @param options 
   */
  scopeConsentContinue(options: { track_id: string }) {
    LoginService.scopeConsentContinue(options);
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
   * claim consent continue login
   * @param options 
   */
  claimConsentContinue(options: { track_id: string }) {
    LoginService.claimConsentContinue(options);
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
    return Helper.createPostPromise(options, _serviceURL, false,"POST", access_token);
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
    return Helper.createPostPromise(options, _serviceURL, false,"POST", access_token);
  };

  /**
   * updateSuggestMFA
   * @param track_id 
   * @param options 
   * @returns 
   */
  updateSuggestMFA(track_id: string, options: ISuggestedMFAActionConfig) {
    return TokenService.updateSuggestMFA(track_id, options)
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
   * @deprecated This function is no longer supported, instead use {this.updateStatus()}
   * @param status_id 
   * @returns 
   */
  updateSocket(status_id: string) {
    return VerificationService.updateStatus(status_id);
  };

  /**
   * update the status of notification
   * @param status_id 
   * @returns 
   */
  updateStatus(status_id: string) {
    return VerificationService.updateStatus(status_id);
  };

  /**
   * setupFidoVerification
   * @param options 
   * @returns 
   */
  setupFidoVerification(options: FidoSetupEntity) {
    return VerificationService.setupFidoVerification(options);
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
   * loginAfterRegister
   * @param options 
   */
  loginAfterRegister(options: { device_id: string; dc?: string; rememberMe: boolean; trackId: string; }) {
    LoginService.loginAfterRegister(options);
  };

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
   * initiate mfa v2
   * @param options 
   * @returns 
   */
  initiateMFAV2(options: IInitVerificationAuthenticationRequestEntity) {
    return VerificationService.initiateMFAV2(options);
  };

  /**
   * initiateVerification
   * @param options 
   */
  initiateVerification(options: IInitVerificationAuthenticationRequestEntity) {
    options.type = options.verification_type
    this.initiateMFAV2(options);
  };

  /**
   * initiate email v2
   * @param options 
   */
  initiateEmailV2(options: IInitVerificationAuthenticationRequestEntity) {
    options.type = "email"
    this.initiateMFAV2(options);
  };

  /**
   * initiate sms v2
   * @param options 
   */
  initiateSMSV2(options: IInitVerificationAuthenticationRequestEntity) {
    options.type = "sms"
    this.initiateMFAV2(options);
  };

  /**
   * initiate ivr v2
   * @param options 
   */
  initiateIVRV2(options: IInitVerificationAuthenticationRequestEntity) {
    options.type = "ivr"
    this.initiateMFAV2(options);
  };

  /**
   * initiate backupcode v2
   * @param options 
   */
  initiateBackupcodeV2(options: IInitVerificationAuthenticationRequestEntity) {
    options.type = "backupcode"
    this.initiateMFAV2(options);
  };

  /**
   * initiate totp v2
   * @param options 
   */
  initiateTOTPV2(options: IInitVerificationAuthenticationRequestEntity) {
    options.type = "totp"
    this.initiateMFAV2(options);
  };

  /**
   * initiate pattern v2
   * @param options 
   */
  initiatePatternV2(options: IInitVerificationAuthenticationRequestEntity) {
    options.type = "pattern"
    this.initiateMFAV2(options);
  };

  /**
   * initiate touchid v2
   * @param options 
   */
  initiateTouchIdV2(options: IInitVerificationAuthenticationRequestEntity) {
    options.type = "touchid"
    this.initiateMFAV2(options);
  };

  /**
   * initiate smart push v2
   * @param options 
   */
  initiateSmartPushV2(options: IInitVerificationAuthenticationRequestEntity) {
    options.type = "push"
    this.initiateMFAV2(options);
  };

  /**
   * initiate face v2
   * @param options 
   */
  initiateFaceV2(options: IInitVerificationAuthenticationRequestEntity) {
    options.type = "face"
    this.initiateMFAV2(options);
  };

  /**
   * initiate voice v2
   * @param options 
   */
  initiateVoiceV2(options: IInitVerificationAuthenticationRequestEntity) {
    options.type = "voice"
    this.initiateMFAV2(options);
  };

  /**
   * @deprecated
   * @param options 
   * @param verificationType 
   * @returns 
   */
  initiateMfaV1(options: any, verificationType: string) {
    return VerificationService.initiateMfaV1(options, verificationType);
  }

  /**
  * @deprecated
  * initiate email - v1
  * @param options 
  */
  initiateEmail(options: any) {
    var verificationType = "EMAIL"
    this.initiateMfaV1(options, verificationType)
  };

  /**
  * @deprecated
  * initiate SMS - v1
  * @param options 
  */
  initiateSMS(options: any) {
    var verificationType = "SMS"
    this.initiateMfaV1(options, verificationType)
  };

  /**
  * @deprecated
  * initiate IVR - v1
  * @param options 
  */
  initiateIVR(options: any) {
    var verificationType = "IVR"
    this.initiateMfaV1(options, verificationType)
  };

  /**
  * @deprecated
  * initiate backup code - v1
  * @param options 
  */
  initiateBackupcode(options: any) {
    var verificationType = "BACKUPCODE"
    this.initiateMfaV1(options, verificationType)
  };

  /**
   * @deprecated
   * initiate TOTP - v1
   * @param options 
   */
  initiateTOTP(options: any) {
    var verificationType = "TOTP";
    this.initiateMfaV1(options, verificationType);
  };

  /**
  * @deprecated
  * initiate pattern - v1
  * @param options 
  */
  initiatePattern(options: any) {
    var verificationType = "PATTERN";
    this.initiateMfaV1(options, verificationType);
  };

  /**
  * @deprecated
  * initiate touchid - v1
  * @param options 
  */
  initiateTouchId(options: any) {
    var verificationType = "TOUCHID";
    this.initiateMfaV1(options, verificationType);
  };

 /**
   * @deprecated
   * initiate push - v1
   * @param options 
   */  initiateSmartPush(options: any) {
    var verificationType = "PUSH";
    this.initiateMfaV1(options, verificationType);
  };

  /**
  * @deprecated
  * initiate face - v1
  * @param options 
  */
  initiateFace(options: any) {
    var verificationType = "FACE";
    this.initiateMfaV1(options, verificationType);
  };

  /**
   * @deprecated
   * initiate Voice - v1
   * @param options 
   */
  initiateVoice(options: any) {
    var verificationType = "VOICE";
    this.initiateMfaV1(options, verificationType);
  };

  /**
   * authenticate mfa v2
   * @param options 
   * @returns 
   */
  authenticateMFAV2(options: IAuthVerificationAuthenticationRequestEntity) {
    return VerificationService.authenticateMFAV2(options);
  };

  /**
   * authenticateVerification
   * @param options 
   */
  authenticateVerification(options: IAuthVerificationAuthenticationRequestEntity) {
    options.type = options.verification_type
    this.authenticateMFAV2(options)
  };

  /**
   * authenticate email v2
   * @param options 
   */
  authenticateEmailV2(options: IAuthVerificationAuthenticationRequestEntity) {
    options.type = "email";
    this.authenticateMFAV2(options);
  };

  /**
   * authenticate sms v2
   * @param options 
   */
  authenticateSMSV2(options: IAuthVerificationAuthenticationRequestEntity) {
    options.type = "sms";
    this.authenticateMFAV2(options);
  };

  /**
   * authenticate ivr v2
   * @param options 
   */
  authenticateIVRV2(options: IAuthVerificationAuthenticationRequestEntity) {
    options.type = "ivr";
    this.authenticateMFAV2(options);
  };

  /**
   * authenticate backupcode v2
   * @param options 
   */
  authenticateBackupcodeV2(options: IAuthVerificationAuthenticationRequestEntity) {
    options.type = "backupcode";
    this.authenticateMFAV2(options);
  };

  /**
   * authenticate totp v2
   * @param options 
   */
  authenticateTOTPV2(options: IAuthVerificationAuthenticationRequestEntity) {
    options.type = "totp";
    this.authenticateMFAV2(options);
  };

  /**
   * authenticateVerification form type (for face)
   * @param options 
   * @returns 
   */
  authenticateFaceVerification(options: FaceVerificationAuthenticationRequestEntity) {
    return VerificationService.authenticateFaceVerification(options);
  };

  /**
   * @deprecated
   * setup verification - v1
   * @param options 
   * @param access_token 
   * @param verificationType 
   * @returns 
   */
  setupVerificationV1(options: any, access_token: string, verificationType: string) {
    return VerificationService.setupVerificationV1(options, access_token, verificationType);
  }
  /**
   * @deprecated
   * setup email - v1
   * @param options 
   * @param access_token 
   */
  setupEmail(options: any, access_token: string) {
    var verificationType = "EMAIL";
    this.setupVerificationV1(options, access_token, verificationType)
  };

  /**
   * @deprecated
   * setup sms - v1
   * @param options 
   * @param access_token 
   */
  setupSMS(options: any, access_token: string) {
    var verificationType = "SMS";
    this.setupVerificationV1(options, access_token, verificationType)
  };

  /**
   * @deprecated
   * setup ivr - v1
   * @param options 
   * @param access_token 
   */
  setupIVR(options: any, access_token: string) {
    var verificationType = "IVR";
    this.setupVerificationV1(options, access_token, verificationType);
  };

  /**
   * @deprecated
   * setup backupcode - v1
   * @param options 
   * @param access_token 
   */
  setupBackupcode(options: any, access_token: string) {
    var verificationType = "BACKUPCODE";
    this.setupVerificationV1(options, access_token, verificationType);
  };

  /**
   * @deprecated
   * setup totp - v1
   * @param options 
   * @param access_token 
   */
  setupTOTP(options: any, access_token: string) {
    var verificationType = "TOTP";
    this.setupVerificationV1(options, access_token, verificationType);
  };

  /**
   * @deprecated
   * setup pattern - v1
   * @param options 
   * @param access_token 
   */
  setupPattern(options: any, access_token: string) {
    var verificationType = "PATTERN";
    this.setupVerificationV1(options, access_token, verificationType);
  };

  /**
   * @deprecated
   * setup touch - v1
   * @param options 
   * @param access_token 
   */
  setupTouchId(options: any, access_token: string) {
    var verificationType = "TOUCHID";
    this.setupVerificationV1(options, access_token, verificationType);
  };

  /**
   * @deprecated
   * setup smart push - v1
   * @param options 
   * @param access_token 
   */
  setupSmartPush(options: any, access_token: string) {
    var verificationType = "PUSH";
    this.setupVerificationV1(options, access_token, verificationType);
  };

  /**
   * @deprecated
   * setup face - v1
   * @param options 
   * @param access_token 
   */
  setupFace(options: any, access_token: string) {
    var verificationType = "FACE";
    this.setupVerificationV1(options, access_token, verificationType);
  };

  /**
   * @deprecated
   * setup voice - v1
   * @param options 
   * @param access_token 
   */
  setupVoice(options: any, access_token: string) {
    var verificationType = "VOICE";
    this.setupVerificationV1(options, access_token, verificationType);
  };

  /**
   * @deprecated
   * enroll verification - v1
   * @param options 
   * @param access_token 
   * @param verificationType 
   * @returns 
   */
  enrollVerificationV1(options: any, access_token: string, verificationType: string) {
    return VerificationService.enrollVerificationV1(options, access_token, verificationType);
  }

  /**
   * @deprecated
   * enroll email - v1
   * @param options 
   * @param access_token 
   */
  enrollEmail(options: any, access_token: string) {
    var verificationType = "EMAIL";
    this.enrollVerificationV1(options, access_token, verificationType);
  };

  /**
   * @deprecated
   * enroll SMS - v1
   * @param options 
   * @param access_token 
   */
  enrollSMS(options: any, access_token: string) {
    var verificationType = "SMS";
    this.enrollVerificationV1(options, access_token, verificationType);
  };

  /**
   * @deprecated
   * enroll IVR - v1
   * @param options 
   * @param access_token 
   */
  enrollIVR(options: any, access_token: string) {
    var verificationType = "IVR";
    this.enrollVerificationV1(options, access_token, verificationType);
  };

  /**
   * @deprecated
   * enroll TOTP - v1
   * @param options 
   * @param access_token 
   */
  enrollTOTP(options: any, access_token: string) {
    var verificationType = "TOTP";
    this.enrollVerificationV1(options, access_token, verificationType);
  };

  /**
   * @deprecated
   * authenticate mfa - v1
   * @param verificationType 
   * @returns 
   */
  authenticateMfaV1(options: any, verificationType: string) {
    return VerificationService.authenticateMfaV1(options, verificationType);
  }

  /**
   * @deprecated
   * authenticate email - v1
   * @param options 
   */
  authenticateEmail(options: any) {
    var verificationType = "EMAIL";
    this.authenticateMfaV1(options, verificationType);
  };

  /**
   * @deprecated
   * authenticate sms - v1
   * @param options 
   */
  authenticateSMS(options: any) {
    var verificationType = "SMS";
    this.authenticateMfaV1(options, verificationType);
  };

  /**
   * @deprecated
   * authenticate ivr - v1
   * @param options 
   */
  authenticateIVR(options: any) {
    var verificationType = "IVR";
    this.authenticateMfaV1(options, verificationType);
  };

  /**
   * @deprecated
   * authenticate backupcode - v1
   * @param options 
   */
  authenticateBackupcode(options: any) {
    var verificationType = "BACKUPCODE";
    this.authenticateMfaV1(options, verificationType);
  };

  /**
   * @deprecated
   * authenticate totp - v1
   * @param options 
   */
  authenticateTOTP(options: any) {
    var verificationType = "TOTP";
    this.authenticateMfaV1(options, verificationType);
  };
}
