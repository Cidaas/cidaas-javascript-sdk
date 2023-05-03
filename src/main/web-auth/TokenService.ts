import { AccessTokenRequest, TokenIntrospectionEntity, ISuggestedMFAActionConfig } from "./Entities"
import { Helper, CustomException } from "./Helper";

export namespace TokenService {

  /**
   * renew token using refresh token
   * @param options 
   * @returns 
   */
  export function renewToken(options: AccessTokenRequest) {
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
   * get access token from code
   * @param options 
   * @returns 
   */
  export function getAccessToken(options: AccessTokenRequest) {
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
  export function validateAccessToken(options: TokenIntrospectionEntity) {
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
   * get scope consent details
   * @param options 
   * @returns 
   */
  export function getScopeConsentDetails(options: {
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
   * updateSuggestMFA
   * @param track_id 
   * @param options 
   * @returns 
   */
  export function updateSuggestMFA(track_id: string, options: ISuggestedMFAActionConfig) {
    var _serviceURL = window.webAuthSettings.authority + "/token-srv/prelogin/suggested/mfa/update/" + track_id;
    return Helper.createPostPromise(options, _serviceURL, false);
  };

  /**
   * getMissingFieldsLogin
   * @param trackId 
   * @returns 
   */
  export function getMissingFieldsLogin(trackId: string) {
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
   * device code flow - verify
   * @param code 
   */
  export function deviceCodeVerify(code: string) {
    var params = `user_code=${encodeURI(code)}`;
    var url = `${window.webAuthSettings.authority}/token-srv/device/verify?${params}`;
    try {
      const options = {
        user_code: encodeURI(code)
      }
      let form = Helper.createForm(url, options, 'GET');
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new Error(ex);
    }
  }
}
