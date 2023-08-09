import { AccessTokenRequest, TokenIntrospectionEntity, ISuggestedMFAActionConfig } from "./Entities"
import { Helper, CustomException } from "./Helper";

export namespace TokenService {

  /**
   * renew token using refresh token
   * @param options 
   * @returns 
   */
  export function renewToken(options: AccessTokenRequest) {
    if (!options.refresh_token) {
      throw new CustomException("refresh_token cannot be empty", 417);
    }
    options.client_id = window.webAuthSettings.client_id;
    options.grant_type = 'refresh_token';
    const _serviceURL = window.webAuthSettings.authority + "/token-srv/token";
    return Helper.createPostPromise(options, _serviceURL, undefined, "POST");
  };

  /**
   * get access token from code
   * @param options 
   * @returns 
   */
  export async function getAccessToken(options: AccessTokenRequest) {
    if (!options.code) {
      throw new CustomException("code cannot be empty", 417);
    }
    options.client_id = window.webAuthSettings.client_id;
    options.redirect_uri = window.webAuthSettings.redirect_uri;
    options.grant_type = "authorization_code";
    if (!window.webAuthSettings.disablePKCE) {
      var signInRequest = await window.usermanager._client.createSigninRequest(window.webAuthSettings);
      options.code_verifier = signInRequest.state?.code_verifier;
    }
    const _serviceURL = window.webAuthSettings.authority + "/token-srv/token";
    return Helper.createPostPromise(options, _serviceURL, undefined, "POST");
  };

  /**
   * validate access token
   * @param options 
   * @returns 
   */
  export function validateAccessToken(options: TokenIntrospectionEntity) {
    if (!options.token || !options.token_type_hint) {
      throw new CustomException("token or token_type_hint cannot be empty", 417);
    }
    const _serviceURL = window.webAuthSettings.authority + "/token-srv/introspect";
    return Helper.createPostPromise(options, _serviceURL, false, "POST");
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
    const _serviceURL = window.webAuthSettings.authority + "/token-srv/prelogin/metadata/" + options.track_id + "?acceptLanguage=" + options.locale;
    return Helper.createPostPromise(undefined, _serviceURL, false, "GET");
  };

  /**
   * updateSuggestMFA
   * @param track_id 
   * @param options 
   * @returns 
   */
  export function updateSuggestMFA(track_id: string, options: ISuggestedMFAActionConfig) {
    const _serviceURL = window.webAuthSettings.authority + "/token-srv/prelogin/suggested/mfa/update/" + track_id;
    return Helper.createPostPromise(options, _serviceURL, false, "POST");
  };

  /**
   * getMissingFieldsLogin
   * @param trackId 
   * @returns 
   */
  export function getMissingFieldsLogin(trackId: string) {
    const _serviceURL = window.webAuthSettings.authority + "/token-srv/prelogin/metadata/" + trackId;
    return Helper.createPostPromise(undefined, _serviceURL, false, "GET");
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
