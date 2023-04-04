import { UserManager, UserManagerSettings } from "oidc-client-ts";
import { Authentication } from "../authentication";
import { CustomException } from "./exception";
import * as CryptoJS from 'crypto-js';
import fingerprint from '@fingerprintjs/fingerprintjs';

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
  CompleteLinkUserEntity,
  IUserLinkEntity,
  UpdateReviewDeviceEntity,
  UserActivityEntity,
  ChangePasswordEntity,
  IConsentAcceptEntity,
  IAuthVerificationAuthenticationRequestEntity,
  FaceVerificationAuthenticationRequestEntity
} from "../entities"

interface WebAuthSetting extends UserManagerSettings {
  mode?: string
}
interface WindowEntity extends Window {
  webAuthSettings: WebAuthSetting;
  usermanager: UserManager;
  localeSettings: string;
  authentication: Authentication;
}

declare var window: WindowEntity;

export class WebAuth {

  private code_verifier: string;

  constructor(settings: WebAuthSetting) {
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
   * get user info
   * @param options 
   * @returns 
   */
  getUserProfile(options: { access_token: string }) {
    return new Promise((resolve, reject) => {
      try {
        if (!options.access_token) {
          throw new CustomException("access_token cannot be empty", 417);
        }
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/userinfo";
        http.onreadystatechange = function () {
          if (http.readyState == 4) {
            resolve(JSON.parse(http.responseText));
          }
        };
        http.open("GET", _serviceURL, true);
        http.setRequestHeader("Content-type", "application/json");
        http.setRequestHeader("Authorization", `Bearer ${options.access_token}`);
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
   * utility function to create and make post request
   * @param options 
   * @param serviceurl 
   * @param errorResolver 
   * @param access_token 
   * @param headers 
   * @returns 
   */
  private createPostPromise(options: any, serviceurl: string, errorResolver: boolean, access_token?: string, headers?: any) {
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        http.onreadystatechange = function () {
          if (http.readyState == 4) {
            if (http.responseText) {
              resolve(JSON.parse(http.responseText));
            } else {
              resolve(errorResolver);
            }
          }
        };
        http.open("POST", serviceurl, true);
        http.setRequestHeader("Content-type", "application/json");
        if (headers) {
          for (var key in headers) {
            if (headers.hasOwnProperty(key)) {
              http.setRequestHeader(key, headers[key]);
            }
          }
        }
        if (access_token) {
          http.setRequestHeader("Authorization", `Bearer ${access_token}`);
        }
        if (window.localeSettings) {
          http.setRequestHeader("accept-language", window.localeSettings);
        }
        if (options) {
          http.send(JSON.stringify(options));
        } else {
          http.send();
        }
      } catch (ex) {
        reject(ex);
      }
    });
  }

  /**
   * renew token using refresh token
   * @param options 
   * @returns 
   */
  renewToken(options: AccessTokenRequest) {
    return new Promise((resolve, reject) => {
      try {
        if (!options.refresh_token) {
          throw new CustomException("refresh_token cannot be empty", 417);
        }
        options.client_id = window.webAuthSettings.client_id;
        options.grant_type = 'refresh_token';
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/token-srv/token";
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
      } catch (ex) {
        reject(ex);
      }
    });
  };

  /**
   * generate code verifier
   */
  generateCodeVerifier() {
    this.code_verifier = crypto.randomUUID().replace(/-/g, "");
  };

  /**
   * 
   * @param code_verifier 
   * @returns 
   */
  generateCodeChallenge(code_verifier: string) {
    return this.base64URL(CryptoJS.SHA256(code_verifier));
  };

  /**
   * 
   * @param string 
   * @returns 
   */
  base64URL(string: any) {
    return string.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
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

    this.generateCodeVerifier();

    var loginURL = settings.authority + "/authz-srv/authz?client_id=" + settings.client_id;
    loginURL += "&redirect_uri=" + settings.redirect_uri;
    loginURL += "&nonce=" + new Date().getTime().toString();
    loginURL += "&response_type=" + settings.response_type;
    loginURL += "&code_challenge=" + this.generateCodeChallenge(this.code_verifier);
    loginURL += "&code_challenge_method=S256";
    if (settings.response_mode && settings.response_mode == 'query') {
      loginURL += "&response_mode=" + settings.response_mode;
    }
    loginURL += "&scope=" + settings.scope;
    console.log(loginURL);
    return loginURL;
  };

  /**
   * get access token from code
   * @param options 
   * @returns 
   */
  getAccessToken(options: AccessTokenRequest) {
    return new Promise((resolve, reject) => {
      try {
        if (!options.code) {
          throw new CustomException("code cannot be empty", 417);
        }
        options.client_id = window.webAuthSettings.client_id;
        options.redirect_uri = window.webAuthSettings.redirect_uri;
        options.code_verifier = this.code_verifier;
        options.grant_type = "authorization_code";
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/token-srv/token";
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
      } catch (ex) {
        reject(ex);
      }
    });
  };

  /**
   * validate access token
   * @param options 
   * @returns 
   */
  validateAccessToken(options: TokenIntrospectionEntity) {
    return new Promise((resolve, reject) => {
      try {
        if (!options.token || !options.token_type_hint) {
          throw new CustomException("token or token_type_hint cannot be empty", 417);
        }
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/token-srv/introspect";
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
      } catch (ex) {
        reject(ex);
      }
    });
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
   * Note: any used as options[key] throws error when options mapped to an interface LoginFormRequestEntity
   * login with username and password
   * @param options 
   */
  loginWithCredentials(options: any) {
    try {
      var form = document.createElement('form');
      form.action = window.webAuthSettings.authority + "/login-srv/login";
      form.method = 'POST';
      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          var hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", options[key]);

          form.appendChild(hiddenField);
        }
      }
      document.body.appendChild(form);
      form.submit();

    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * Note: The interface is defined as LoginFormRequestEntity, throws error when type is used for parameter options as it does not satify the defination
   * the body in the request is passed as string
   * note sure what is the purpose of this function
   * login with username and password and return response
   * @param options 
   * @returns 
   */
  async loginWithCredentialsAsynFn(options: any) {
    try {
      var searchParams = new URLSearchParams(options); // todo
      var response = await fetch(window.webAuthSettings.authority + "/login-srv/login", {
        method: "POST",
        redirect: "follow",
        body: searchParams.toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      });

      return response;
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * login with social
   * @param options 
   * @param queryParams 
   */
  loginWithSocial(
    options: { provider: string; requestId: string; },
    queryParams: { dc: string; device_fp: string }
  ) {
    try {
      var _serviceURL = window.webAuthSettings.authority + "/login-srv/social/login/" + options.provider.toLowerCase() + "/" + options.requestId;
      if (queryParams && queryParams.dc && queryParams.device_fp) {
        _serviceURL = _serviceURL + "?dc=" + queryParams.dc + "&device_fp=" + queryParams.device_fp;
      }
      window.location.href = _serviceURL;
    } catch (ex) {
      console.log(ex);
    }
  };

  /**
   * register with social
   * @param options 
   * @param queryParams 
   */
  registerWithSocial(
    options: { provider: string; requestId: string; },
    queryParams: { dc: string; device_fp: string }) {
    try {
      var _serviceURL = window.webAuthSettings.authority + "/login-srv/social/register/" + options.provider.toLowerCase() + "/" + options.requestId;
      if (queryParams && queryParams.dc && queryParams.device_fp) {
        _serviceURL = _serviceURL + "?dc=" + queryParams.dc + "&device_fp=" + queryParams.device_fp;
      }
      window.location.href = _serviceURL;
    } catch (ex) {
      console.log(ex);
    }
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
   * Note: endpoint not found in https://gitlab.widas.de/cidaas-v2/device-management/cidaas-devices-srv/
   * edpoint available in https://gitlab.widas.de/cidaas-v2/device-management/device-srv, 
   * GET request, no request body required, options.userAgent assignment is done inside function block
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
   * register user
   * @param options 
   * @param headers 
   * @returns 
   */
  register(options: UserEntity, headers: {
    requestId: string;
    captcha?: string;
    acceptlanguage?: string;
    bot_captcha_response?: string;
    trackid: string;
    trackId: string;
  }) {
    return new Promise((resolve, reject) => {
      try {

        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/register";
        if (options.invite_id) {
          _serviceURL = _serviceURL + "?invite_id=" + options.invite_id;
        }
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
        http.setRequestHeader("requestId", headers.requestId);
        if (headers.captcha) {
          http.setRequestHeader("captcha", headers.captcha);
        }
        if (headers.acceptlanguage) {
          http.setRequestHeader("accept-language", headers.acceptlanguage);
        } else if (window.localeSettings) {
          http.setRequestHeader("accept-language", window.localeSettings);
        }
        if (headers.bot_captcha_response) {
          http.setRequestHeader("bot_captcha_response", headers.bot_captcha_response);
        }
        let trackId = headers.trackid || headers.trackId;
        if (trackId) {
          http.setRequestHeader("trackid", trackId);
        }
        http.send(JSON.stringify(options));
      } catch (ex) {
        reject(ex);
      }
    });
  };

  /**
   * get invite info
   * @param options 
   * @returns 
   */
  getInviteUserDetails(options: { invite_id: string }) {
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/invite/info/" + options.invite_id;
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
   * get Communication status
   * @param options 
   * @returns 
   */
  getCommunicationStatus(options: { sub: string, requestId: string }) {
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/communication/status/" + options.sub;
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
        if (options.requestId) {
          http.setRequestHeader("requestId", options.requestId);
        }
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
   * Note: any used as options[key] throws error when options mapped to an interface AccountVerificationRequestEntity. copy of the function initiateAccountVerificationAsynFn
   * initiate verification
   * @param options 
   * @returns 
   */
  initiateAccountVerification(options: any) {
    try {
      var form = document.createElement('form');
      form.action = window.webAuthSettings.authority + "/verification-srv/account/initiate";
      form.method = 'POST';
      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          var hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", options[key]);

          form.appendChild(hiddenField);
        }
      }
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * Note: The interface is defined as AccountVerificationRequestEntity, throws error when type is used for parameter options as it does not satify the defination
   * the body in the request is passed as string
   * note sure what is the purpose of this function
   * initiate verification and return response
   * @param options 
   * @returns 
   */
  async initiateAccountVerificationAsynFn(options: any) {
    try {
      var searchParams = new URLSearchParams(options);
      var response = await fetch(window.webAuthSettings.authority + "/verification-srv/account/initiate", {
        method: "POST",
        redirect: "follow",
        body: searchParams.toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      });

      return response;

    } catch (ex) {
      throw new CustomException(ex, 417);
    }

  };

  /**
   * verify account
   * @param options 
   * @returns 
   */
  verifyAccount(options: {
    accvid: string;
    code: string;
  }) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/account/verify";
    return this.createPostPromise(options, _serviceURL, false);
  };

  /**
   * initiate reset password
   * @param options 
   * @returns 
   */
  initiateResetPassword(options: ResetPasswordEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/resetpassword/initiate";
    return this.createPostPromise(options, _serviceURL, false);
  };


  /**
   * note: any used as options[key] throws error when options mapped to an interface ValidateResetPasswordEntity
   * handle reset password
   * @param options 
   */
  handleResetPassword(options: any) {
    try {
      var form = document.createElement('form');
      form.action = window.webAuthSettings.authority + "/users-srv/resetpassword/validatecode";
      form.method = 'POST';
      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          var hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", options[key]);

          form.appendChild(hiddenField);
        }
      }
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };


  /**
  * note: any used as options[key] throws error when options mapped to an interface AcceptResetPasswordEntity
  * reset password
  * @param options 
  */
  resetPassword(options: any) {
    try {
      var form = document.createElement('form');
      form.action = window.webAuthSettings.authority + "/users-srv/resetpassword/accept";
      form.method = 'POST';
      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          var hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", options[key]);

          form.appendChild(hiddenField);
        }
      }
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * note: the endpoint not found in verification-srv https://gitlab.widas.de/cidaas-v2/pluggable-adv-authentication-methods/cidaas-verification-srv
   * get mfa list
   * @param options 
   * @returns 
   */
  getMFAList(options: { sub: string; email: string }) {
    return new Promise((resolve, reject) => {
      try {
        var query = "";
        if (!options.email && !options.sub) {
          throw new CustomException("either sub or email cannot be empty", 417);
        }
        if (options.sub) {
          query = "?sub=" + options.sub;
        } else {
          query = "?email=" + options.email;
        }
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/verification-srv/settings/list" + query;
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
   * get mfa list v2
   * @param options 
   * @returns 
   */
  getMFAListV2(options: IConfiguredListRequestEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/public/configured/list";
    return this.createPostPromise(options, _serviceURL, false);
  };

  /**
   * cancel mfa v2
   * @param options 
   * @returns 
   */
  cancelMFAV2(options: {
    exchange_id: string;
    reason: string;
    type: string;
  }) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/cancel/" + options.type;
    return this.createPostPromise(options, _serviceURL, undefined);
  };

  /** 
   * passwordless login
   * note: any used as options[key] throws error when options mapped to an interface
   * @param options 
   */
  passwordlessLogin(options: any) {
    try {
      var form = document.createElement('form');
      form.action = window.webAuthSettings.authority + "/login-srv/verification/login";
      form.method = 'POST';
      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          var hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", options[key]);

          form.appendChild(hiddenField);
        }
      }
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * note: the endpoint not found consent mgmt srv https://gitlab.widas.de/cidaas-v2/consent-management/cidaas-consent-management-srv
   * get consent details
   * @param options 
   * @returns 
   */
  getConsentDetails(options: any) {
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/settings/public?name=" + options.consent_name;
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
   * get user consent details
   * @param options 
   * @returns 
   */
  getConsentDetailsV2(options: {
    consent_id: string;
    consent_version_id: string;
    sub: string;
  }) {
    var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/usage/public/info";
    return this.createPostPromise(options, _serviceURL, false);
  };

  /**
   * note: the endpoint not found consent mgmt srv https://gitlab.widas.de/cidaas-v2/consent-management/cidaas-consent-management-srv
   * accept consent
   * @param options 
   * @returns 
   */
  acceptConsent(options: any) {
    var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/user/status";
    return this.createPostPromise(options, _serviceURL, false);
  };

  /**
   * accept constn v2
   * @param options 
   * @returns 
   */
  acceptConsentV2(options: IConsentAcceptEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/usage/accept";
    return this.createPostPromise(options, _serviceURL, false);
  };

  /**
   * get scope consent details
   * @param options 
   * @returns 
   */
  getScopeConsentDetails(options: {
    track_id: string;
    locale: string;
  }) {
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/token-srv/prelogin/metadata/" + options.track_id + "?acceptLanguage=" + options.locale;
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
   * get scope consent version details
   * @param options 
   * @returns 
   */
  getScopeConsentVersionDetailsV2(options: {
    scopeid: string;
    locale: string;
    access_token: string;
  }) {
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/versions/details/" + options.scopeid + "?locale=" + options.locale;
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
        http.setRequestHeader("Authorization", `Bearer ${options.access_token}`);
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
   * accept scope Consent
   * @param options 
   * @returns 
   */
  acceptScopeConsent(options: {
    client_id: string;
    sub: string;
    scopes: string[];
  }) {
    var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/consent/scope/accept";
    return this.createPostPromise(options, _serviceURL, false);
  };

  /**
   * duplicate functions -> consentContinue
   * scope consent continue login
   * @param options 
   */
  scopeConsentContinue(options: { track_id: string }) {
    try {
      var form = document.createElement('form');
      form.action = window.webAuthSettings.authority + "/login-srv/precheck/continue/" + options.track_id;
      form.method = 'POST';
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * accept claim Consent
   * @param options 
   * @returns 
   */
  acceptClaimConsent(options: {
    client_id: string;
    sub: string;
    accepted_claims: string[];
  }) {
    var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/consent/claim/accept";
    return this.createPostPromise(options, _serviceURL, false);
  };

  /**
   * duplicate functions -> consentContinue
   * claim consent continue login
   * @param options 
   */
  claimConsentContinue(options: { track_id: string }) {
    try {
      var form = document.createElement('form');
      form.action = window.webAuthSettings.authority + "/login-srv/precheck/continue/" + options.track_id;
      form.method = 'POST';
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * revoke claim Consent
   * @param options 
   * @returns 
   */
  revokeClaimConsent(options: {
    client_id: string;
    sub: string;
    revoked_claims: string[];
  }) {
    var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/consent/claim/revoke";
    return this.createPostPromise(options, _serviceURL, false);
  };

  /**
   * get Deduplication details
   * @param options 
   * @returns 
   */
  getDeduplicationDetails(options: { trackId: string }) {
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/deduplication/info/" + options.trackId;
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
   * deduplication login
   * @param options 
   */
  deduplicationLogin(options: { trackId: string, requestId: string, sub: string }) {
    try {
      var form = document.createElement('form');
      form.action = window.webAuthSettings.authority + "/users-srv/deduplication/login/redirection?trackId=" + options.trackId + "&requestId=" + options.requestId + "&sub=" + options.sub;
      form.method = 'POST';
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * register Deduplication
   * @param options 
   * @returns 
   */
  registerDeduplication(options: { trackId: string }) {
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/deduplication/register/" + options.trackId;
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
        http.send();
      } catch (ex) {
        reject(ex);
      }
    });
  };

  /**
   * note: any used as options[key] throws error when mapped to an interface. duplicate functions -> mfaContinue, firstTimeChangePassword, scopeConsentContinue and claimConsentContinue
   * consent continue login
   * @param options 
   */
  consentContinue(options: any) {
    try {
      var form = document.createElement('form');
      form.action = window.webAuthSettings.authority + "/login-srv/precheck/continue/" + options.track_id;
      form.method = 'POST';
      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          var hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", options[key]);

          form.appendChild(hiddenField);
        }
      }
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * note: any used as options[key] throws error if the interface IChangePasswordEntity used
   * mfa continue login
   * @param options 
   */
  mfaContinue(options: any) {
    try {
      var form = document.createElement('form');
      form.action = window.webAuthSettings.authority + "/login-srv/precheck/continue/" + options.track_id;
      form.method = 'POST';
      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          var hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", options[key]);

          form.appendChild(hiddenField);
        }
      }
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * note: any used as options[key] throws error if the interface IChangePasswordEntity used
   * change password continue
   * @param options 
   */
  firstTimeChangePassword(options: any) {
    try {
      var form = document.createElement('form');
      form.action = window.webAuthSettings.authority + "/login-srv/precheck/continue/" + options.loginSettingsId;
      form.method = 'POST';
      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          var hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", options[key]);

          form.appendChild(hiddenField);
        }
      }
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * change password
   * @param options 
   * @param access_token 
   * @returns 
   */
  changePassword(options: ChangePasswordEntity, access_token: string) {
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/changepassword";
    return this.createPostPromise(options, _serviceURL, false, access_token);
  };


  /**
   * update profile
   * @param options 
   * @param access_token 
   * @param sub 
   * @returns 
   */
  updateProfile(options: UserEntity, access_token: string, sub: string) {
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/profile/" + sub;
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
   * get user activities
   * @param options 
   * @param access_token 
   * @returns 
   */
  getUserActivities(options: UserActivityEntity, access_token: string) {
    var _serviceURL = window.webAuthSettings.authority + "/useractivity-srv/latestactivity";
    return this.createPostPromise(options, _serviceURL, false, access_token);
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
   * note: could not find the endpoint being used here in https://gitlab.widas.de/cidaas-v2/consent-management/cidaas-consent-management-srv/
   * get accepted consent list
   * @param options 
   * @param access_token 
   * @returns 
   */
  getAcceptedConsentList(options: any, access_token: string) {
    var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/user/details/consent";
    return this.createPostPromise(options, _serviceURL, false, access_token);
  };

  /**
   * note: could not find the endpoint being used here in https://gitlab.widas.de/cidaas-v2/consent-management/cidaas-consent-management-srv/
   * view accepted consent
   * @param options 
   * @param access_token 
   * @returns 
   */
  viewAcceptedConsent(options: any, access_token: string) {
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/user/receipt/" + options.consentReceiptID + "?sub=" + options.sub;
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
   * note: the endpoint not found in verification-srv https://gitlab.widas.de/cidaas-v2/pluggable-adv-authentication-methods/cidaas-verification-srv
   * the route must have been changed to /verification-srv/config/list(available in the same service). could be a duplicate of the function getAllVerificationList
   * get configured verification list
   * @param options 
   * @param access_token 
   * @returns 
   */
  getConfiguredVerificationList(options: any, access_token: string) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/settings/list";
    return this.createPostPromise(options, _serviceURL, false, access_token);
  };

  /**
   * note: POST request not available in verification-srv, found GET request. GET request is made in the function getMFAList
   * @param access_token 
   * @returns 
   */
  getAllVerificationList(access_token: string) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/config/list";
    return this.createPostPromise(undefined, _serviceURL, false, access_token);
  };

  /**
   * initiate link accoount
   * @param options 
   * @param access_token 
   * @returns 
   */
  initiateLinkAccount(options: IUserLinkEntity, access_token: string) {
    options.user_name_type = 'email';
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/link/initiate";
    return this.createPostPromise(options, _serviceURL, false, access_token);
  };

  /**
   * complete link accoount
   * @param options 
   * @param access_token 
   * @returns 
   */
  completeLinkAccount(options: CompleteLinkUserEntity, access_token: string) {
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/link/complete";
    return this.createPostPromise(options, _serviceURL, false, access_token);
  };

  /**
   * get linked users
   * @param access_token 
   * @param sub 
   * @returns 
   */
  getLinkedUsers(access_token: string, sub: string) {
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/userinfo/social/" + sub;
    return this.createPostPromise(undefined, _serviceURL, false, access_token);
  };

  /**
   * unlink accoount
   * @param access_token 
   * @param identityId 
   * @returns 
   */
  unlinkAccount(access_token: string, identityId: string) {
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/unlink/" + identityId;
    return this.createPostPromise(undefined, _serviceURL, false, access_token);
  };

  /**
   * image upload
   * @param options 
   * @param access_token 
   * @returns 
   */
  updateProfileImage(options: { image_key: string; }, access_token: string) {
    var _serviceURL = window.webAuthSettings.authority + "/image-srv/profile/upload";
    return this.createPostPromise(options, _serviceURL, false, access_token);
  };

  /**
   * updateSuggestMFA
   * @param track_id 
   * @param options 
   * @returns 
   */
  updateSuggestMFA(track_id: string, options: ISuggestedMFAActionConfig) {
    var _serviceURL = window.webAuthSettings.authority + "/token-srv/prelogin/suggested/mfa/update/" + track_id;
    return this.createPostPromise(options, _serviceURL, false);
  };

  /**
   * enrollVerification
   * @param options 
   * @returns 
   */
  enrollVerification(options: IEnrollVerificationSetupRequestEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/enroll/" + options.verification_type;
    return this.createPostPromise(options, _serviceURL, undefined);
  };

  /**
   * @deprecated This function is no longer supported, instead use {this.updateStatus()}
   * @param status_id 
   * @returns 
   */
  updateSocket(status_id: string) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/notification/status/" + status_id;
    return this.createPostPromise(undefined, _serviceURL, undefined);
  };

  /**
   * update the status of notification
   * @param status_id 
   * @returns 
   */
  updateStatus(status_id: string) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/notification/status/" + status_id;
    return this.createPostPromise(undefined, _serviceURL, undefined);
  };

  /**
   * setupFidoVerification
   * @param options 
   * @returns 
   */
  setupFidoVerification(options: FidoSetupEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/initiate/suggestmfa/" + options.verification_type;
    return this.createPostPromise(options, _serviceURL, undefined);
  };

  /**
   * checkVerificationTypeConfigured
   * @param options 
   * @returns 
   */
  checkVerificationTypeConfigured(options: IConfiguredListRequestEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/public/configured/check/" + options.verification_type;
    return this.createPostPromise(options, _serviceURL, undefined);
  };

  /**
   * deleteUserAccount
   * @param options 
   * @returns 
   */
  deleteUserAccount(options: { access_token: string, sub: string }) {
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/unregister/scheduler/schedule/" + options.sub;
    return this.createPostPromise(options, _serviceURL, undefined, options.access_token);
  };

  /**
   * getMissingFieldsLogin
   * @param trackId 
   * @returns 
   */
  getMissingFieldsLogin(trackId: string) {
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/token-srv/prelogin/metadata/" + trackId;
        http.onreadystatechange = function () {
          if (http.readyState == 4) {
            if (http.responseText) {
              resolve(JSON.parse(http.responseText));
            } else {
              resolve(undefined);
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
   * progressiveRegistration
   * @param options 
   * @param headers 
   * @returns 
   */
  progressiveRegistration(options: IUserEntity, headers: {
    requestId: string;
    trackId: string;
    acceptlanguage: string;
  }) {
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/login-srv/progressive/update/user";
        http.onreadystatechange = function () {
          if (http.readyState == 4) {
            if (http.responseText) {
              resolve(JSON.parse(http.responseText));
            } else {
              resolve(undefined);
            }
          }
        };
        http.open("POST", _serviceURL, true);
        http.setRequestHeader("Content-type", "application/json");
        http.setRequestHeader("requestId", headers.requestId);
        http.setRequestHeader("trackId", headers.trackId);
        if (headers.acceptlanguage) {
          http.setRequestHeader("accept-language", headers.acceptlanguage);
        } else if (window.localeSettings) {
          http.setRequestHeader("accept-language", window.localeSettings);
        }
        http.send(JSON.stringify(options));
      } catch (ex) {
        reject(ex);
      }
    });
  };

  /**
   * loginAfterRegister
   * @param options 
   */
  loginAfterRegister(options: any) {
    try {
      var form = document.createElement('form');
      form.action = window.webAuthSettings.authority + "/login-srv/login/handle/afterregister/" + options.trackId;
      form.method = 'POST';
      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          var hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", options[key]);

          form.appendChild(hiddenField);
        }
      }
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * device code flow - verify
   * @param code 
   */
  deviceCodeVerify(code: string) {
    var params = `user_code=${encodeURI(code)}`;
    var url = `${window.webAuthSettings.authority}/token-srv/device/verify?${params}`;
    try {
      var form = document.createElement('form');
      form.action = url
      form.method = 'GET';
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", 'user_code');
      hiddenField.setAttribute("value", encodeURI(code));

      form.appendChild(hiddenField);
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new Error(ex);
    }
  }

  /**
   * check if an user exists
   * @param options 
   * @returns 
   */
  userCheckExists(options: FindUserEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/checkexists/" + options.requestId;
    return this.createPostPromise(options, _serviceURL, undefined);
  };

  /**
   * To set accept language
   * @param acceptLanguage 
   */
  setAcceptLanguageHeader(acceptLanguage: string) {
    window.localeSettings = acceptLanguage;
  }

  /**
   * get device info
   * @returns 
   */
  getDeviceInfo() {
    return new Promise((resolve, reject) => {
      try {
        var value = ('; ' + document.cookie).split(`; cidaas_dr=`).pop().split(';')[0];
        var fpPromise = fingerprint.load();
        var options = { fingerprint: "", userAgent: "" };
        if (!value) {
          (async () => {
            var fp = await fpPromise;
            var result = await fp.get();
            options.fingerprint = result.visitorId
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
   * initiate mfa v2
   * @param options 
   * @returns 
   */
  initiateMFAV2(options: IInitVerificationAuthenticationRequestEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/initiate/" + options.type;
    return this.createPostPromise(options, _serviceURL, false);
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
   * @param options 
   * @param verificationType 
   * @returns 
   */
  initiateMfaV1(options: any, verificationType: string) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + verificationType.toLowerCase() + "/initiate";
    return this.createPostPromise(options, _serviceURL, false);
  }

  /**
  * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function initiateMfaV1
  * initiate email
  * @param options 
  */
  initiateEmail(options: any) {
    var verificationType = "EMAIL"
    this.initiateMfaV1(options, verificationType)
  };

  /**
  * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function initiateMfaV1
  * initiate SMS
  * @param options 
  */
  initiateSMS(options: any) {
    var verificationType = "SMS"
    this.initiateMfaV1(options, verificationType)
  };

  /**
  * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function initiateMfaV1
  * initiate IVR
  * @param options 
  */
  initiateIVR(options: any) {
    var verificationType = "IVR"
    this.initiateMfaV1(options, verificationType)
  };


  /**
  * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function initiateMfaV1
  * initiate backup code
  * @param options 
  */
  initiateBackupcode(options: any) {
    var verificationType = "BACKUPCODE"
    this.initiateMfaV1(options, verificationType)
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function initiateMfaV1
   * initiate TOTP
   * @param options 
   */
  initiateTOTP(options: any) {
    var verificationType = "TOTP";
    this.initiateMfaV1(options, verificationType);
  };

  /**
  * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function initiateMfaV1
  * initiate pattern
  * @param options 
  */
  initiatePattern(options: any) {
    var verificationType = "PATTERN";
    this.initiateMfaV1(options, verificationType);
  };

  /**
  * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function initiateMfaV1
  * initiate touchid
  * @param options 
  */
  initiateTouchId(options: any) {
    var verificationType = "TOUCHID";
    this.initiateMfaV1(options, verificationType);
  };

 /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function initiateMfaV1
   * initiate push
   * @param options 
   */  initiateSmartPush(options: any) {
    var verificationType = "PUSH";
    this.initiateMfaV1(options, verificationType);
  };

  /**
  * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function initiateMfaV1
  * initiate face
  * @param options 
  */
  initiateFace(options: any) {
    var verificationType = "FACE";
    this.initiateMfaV1(options, verificationType);
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function initiateMfaV1
   * initiate Voice
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
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/authenticate/" + options.type;
    return this.createPostPromise(options, _serviceURL, undefined);
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
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/authenticate/face";
        http.onreadystatechange = function () {
          if (http.readyState == 4) {
            if (http.responseText) {
              resolve(JSON.parse(http.responseText));
            } else {
              resolve(undefined);
            }
          }
        };
        http.open("POST", _serviceURL, true);
        http.setRequestHeader("Content-type", "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW");
        if (window.localeSettings) {
          http.setRequestHeader("accept-language", window.localeSettings);
        }
        http.send(JSON.stringify(options));
      } catch (ex) {
        reject(ex);
      }
    });
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type
   * @param options 
   * @param access_token 
   * @param verificationType 
   * @returns 
   */
  setupVerificationV1(options: any, access_token: string, verificationType: string) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + verificationType.toLowerCase() + "/setup";
    return this.createPostPromise(options, _serviceURL, false, access_token);
  }
  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function setupVerificationV1
   * setup email
   * @param options 
   * @param access_token 
   */
  setupEmail(options: any, access_token: string) {
    var verificationType = "EMAIL";
    this.setupVerificationV1(options, access_token, verificationType)
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function setupVerificationV1
   * setup sms
   * @param options 
   * @param access_token 
   */
  setupSMS(options: any, access_token: string) {
    var verificationType = "SMS";
    this.setupVerificationV1(options, access_token, verificationType)
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function setupVerificationV1
   * setup ivr
   * @param options 
   * @param access_token 
   */
  setupIVR(options: any, access_token: string) {
    var verificationType = "IVR";
    this.setupVerificationV1(options, access_token, verificationType);
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function setupVerificationV1
   * setup backupcode
   * @param options 
   * @param access_token 
   */
  setupBackupcode(options: any, access_token: string) {
    var verificationType = "BACKUPCODE";
    this.setupVerificationV1(options, access_token, verificationType);
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function setupVerificationV1
   * setup totp
   * @param options 
   * @param access_token 
   */
  setupTOTP(options: any, access_token: string) {
    var verificationType = "TOTP";
    this.setupVerificationV1(options, access_token, verificationType);
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function setupVerificationV1
   * setup pattern
   * @param options 
   * @param access_token 
   */
  setupPattern(options: any, access_token: string) {
    var verificationType = "PATTERN";
    this.setupVerificationV1(options, access_token, verificationType);
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function setupVerificationV1
   * setup touch
   * @param options 
   * @param access_token 
   */
  setupTouchId(options: any, access_token: string) {
    var verificationType = "TOUCHID";
    this.setupVerificationV1(options, access_token, verificationType);
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function setupVerificationV1
   * setup smart push
   * @param options 
   * @param access_token 
   */
  setupSmartPush(options: any, access_token: string) {
    var verificationType = "PUSH";
    this.setupVerificationV1(options, access_token, verificationType);
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function setupVerificationV1
   * setup face
   * @param options 
   * @param access_token 
   */
  setupFace(options: any, access_token: string) {
    var verificationType = "FACE";
    this.setupVerificationV1(options, access_token, verificationType);
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function setupVerificationV1
   * setup voice
   * @param options 
   * @param access_token 
   */
  setupVoice(options: any, access_token: string) {
    var verificationType = "VOICE";
    this.setupVerificationV1(options, access_token, verificationType);
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type
   * @param options 
   * @param access_token 
   * @param verificationType 
   * @returns 
   */
  enrollVerificationV1(options: any, access_token: string, verificationType: string) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + verificationType.toLowerCase() + "/enroll";
    return this.createPostPromise(options, _serviceURL, false, access_token);
  }

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function enrollVerificationV1
   * enroll email
   * @param options 
   * @param access_token 
   */
  enrollEmail(options: any, access_token: string) {
    var verificationType = "EMAIL";
    this.enrollVerificationV1(options, access_token, verificationType);
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function enrollVerificationV1
   * enroll SMS
   * @param options 
   * @param access_token 
   */
  enrollSMS(options: any, access_token: string) {
    var verificationType = "SMS";
    this.enrollVerificationV1(options, access_token, verificationType);
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function enrollVerificationV1
   * enroll IVR
   * @param options 
   * @param access_token 
   */
  enrollIVR(options: any, access_token: string) {
    var verificationType = "IVR";
    this.enrollVerificationV1(options, access_token, verificationType);
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function enrollVerificationV1
   * enroll TOTP
   * @param options 
   * @param access_token 
   */
  enrollTOTP(options: any, access_token: string) {
    var verificationType = "TOTP";
    this.enrollVerificationV1(options, access_token, verificationType);
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type
   * @param verificationType 
   * @returns 
   */
  authenticateMfaV1(options: any, verificationType: string) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + verificationType.toLowerCase() + "/authenticate";
    return this.createPostPromise(options, _serviceURL, false);
  }

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function authenticateMfaV1
   * authenticate email
   * @param options 
   */
  authenticateEmail(options: any) {
    var verificationType = "EMAIL";
    this.authenticateMfaV1(options, verificationType);
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function authenticateMfaV1 
   * authenticate sms
   * @param options 
   */
  authenticateSMS(options: any) {
    var verificationType = "SMS";
    this.authenticateMfaV1(options, verificationType);
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function authenticateMfaV1 
   * authenticate ivr
   * @param options 
   */
  authenticateIVR(options: any) {
    var verificationType = "IVR";
    this.authenticateMfaV1(options, verificationType);
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function authenticateMfaV1 
   * authenticate backupcode
   * @param options 
   */
  authenticateBackupcode(options: any) {
    var verificationType = "BACKUPCODE";
    this.authenticateMfaV1(options, verificationType);
  };

  /**
   * Note: v1 endpoint, not used anymore. so options mapped to any type and refactored to call the function authenticateMfaV1 
   * authenticate totp
   * @param options 
   */
  authenticateTOTP(options: any) {
    var verificationType = "TOTP";
    this.authenticateMfaV1(options, verificationType);
  };
}
