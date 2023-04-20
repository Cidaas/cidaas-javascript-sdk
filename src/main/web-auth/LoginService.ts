import { Helper, CustomException } from "./Helper";
import {
  IUserEntity,
  LoginFormRequestEntity,
  PhysicalVerificationLoginRequest,
  LoginFormRequestAsyncEntity,
  IChangePasswordEntity
} from "./Entities"


export namespace LoginService {

  /**
 * login with username and password
 * @param options 
 */
  export function loginWithCredentials(options: LoginFormRequestEntity) {
    try {
      const url = window.webAuthSettings.authority + "/login-srv/login";
      let form = Helper.createForm(url, options)
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
 * login with username and password and return response
 * @param options 
 * @returns 
 */
  export function loginWithCredentialsAsynFn(options: LoginFormRequestAsyncEntity) {
    try {
      var searchParams = new URLSearchParams(options);
      var response = fetch(window.webAuthSettings.authority + "/login-srv/login", {
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
  export function loginWithSocial(
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
  export function registerWithSocial(
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
  * passwordless login
  * @param options 
  */
  export function passwordlessLogin(options: PhysicalVerificationLoginRequest) {
    try {
      const url = window.webAuthSettings.authority + "/login-srv/verification/login";
      let form = Helper.createForm(url, options)
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * scope consent continue after token pre check
   * @param options 
   */
  export function scopeConsentContinue(options: { track_id: string }) {
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
   * claim consent continue login
   * @param options 
   */
  export function claimConsentContinue(options: { track_id: string }) {
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
  * consent continue login
  * @param options 
  */
  export function consentContinue(options: {
    client_id: string;
    consent_refs: string[];
    sub: string;
    scopes: string[];
    matcher: any;
    track_id: string;
  }) {
    try {
      const url = window.webAuthSettings.authority + "/login-srv/precheck/continue/" + options.track_id;
      let form = Helper.createForm(url, options)
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * mfa continue login
   * @param options 
   */
  export function mfaContinue(options: PhysicalVerificationLoginRequest & { track_id: string }) {
    try {
      const url = window.webAuthSettings.authority + "/login-srv/precheck/continue/" + options.track_id;
      let form = Helper.createForm(url, options)
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * change password continue
   * @param options 
   */
  export function firstTimeChangePassword(options: IChangePasswordEntity) {
    try {
      const url = window.webAuthSettings.authority + "/login-srv/precheck/continue/" + options.loginSettingsId;;
      let form = Helper.createForm(url, options)
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * progressiveRegistration
   * @param options 
   * @param headers 
   * @returns 
   */
  export function progressiveRegistration(options: IUserEntity, headers: {
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
  export function loginAfterRegister(options: {
    device_id: string;
    dc?: string;
    rememberMe: boolean;
    trackId: string;
  }) {
    try {
      const url = window.webAuthSettings.authority + "/login-srv/login/handle/afterregister/" + options.trackId;
      let form = Helper.createForm(url, options)
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };
}
