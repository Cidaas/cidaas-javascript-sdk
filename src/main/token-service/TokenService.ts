import { GenerateTokenFromCodeRequest, GrantType, TokenClaim, TokenHeader, TokenIntrospectionRequest } from "./TokenService.model";
import { Helper, CustomException } from "../common/Helper";
import { JwtHelper } from "../common/JwtHelper";
import { HTTPRequestHeader, LoginPrecheckRequest } from "../common/Common.model";

/**
 * To generate token(s) with the grant type authorization_code, call **generateTokenFromCode()**
 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/4ff850f48629a-generate-token for more details.
 * @example
 * ```js
 * const options = {
 *   code: "your code to be exchanged with the token(s)",
 * }
 * 
 * cidaas.generateTokenFromCode(options)
 *   .then(function (response) {
 *     // type your code here
 *   })
 *   .catch(function (ex) {
 *     // your failure code here
 *   });
 * ```
 */
export async function generateTokenFromCode(options: GenerateTokenFromCodeRequest) {
  if (!options.code) {
    throw new CustomException("code cannot be empty", 417);
  }
  options.client_id = window.webAuthSettings.client_id;
  options.redirect_uri = window.webAuthSettings.redirect_uri;
  options.grant_type = GrantType.AuthorizationCode;
  if (!window.webAuthSettings.disablePKCE) {
    const signInRequest = await window.usermanager.getClient().createSigninRequest(window.webAuthSettings);
    options.code_verifier = signInRequest.state?.code_verifier;
  }
  const _serviceURL = window.webAuthSettings.authority + "/token-srv/token";
  return Helper.createHttpPromise(options, _serviceURL, undefined, "POST");
}

/**
 * To validate an access token, call **validateAccessToken()**.
 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/26ff31e2937f1-introspect-with-bearer-token for more details.
 * @example 
 * ```js
 * const options = {
 *   roles: ['role1', 'role2'],
 *   strictRoleValidation: true
 * }
 * 
 * cidaas.validateAccessToken(options)
 * .then(function (response) {
 *   // type your code here
 * })
 * .catch(function (ex) {
 *   // your failure code here
 * });
 * ```
 */
export function validateAccessToken(options?: TokenIntrospectionRequest) {
  const _serviceURL = window.webAuthSettings.authority + "/token-srv/introspect";
  if (options?.token) {
    return Helper.createHttpPromise(options, _serviceURL, false, "POST", options.token);
  }
  Helper.getAccessTokenFromUserStorage().then((accessToken) => {
    return Helper.createHttpPromise(options, _serviceURL, false, "POST", accessToken);
  });
}

/**
 * To get precheck result after login, call **loginPrecheck()**. If there is missing information, user will be redirected to either accepting consent, changing password, continuing MFA process, or do progressive registration
 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/aappczju1t3uh-precheck-information for more details.
 * @example
 * ```js
 * const options = {
 *   trackId: "your track id from login",
 *   locale: "your preferred locale. DEPRECATED as it is not supported anymore. Will be removed in next major release",
 * }
 * 
 * cidaas.loginPrecheck(options)
 * .then(function (response) {
 *   // type your code here
 * })
 * .catch(function (ex) {
 *   // your failure code here
 * });
 * ```
 */
export function loginPrecheck(options: LoginPrecheckRequest, headers?: HTTPRequestHeader) {
  const _serviceURL = window.webAuthSettings.authority + "/token-srv/prelogin/metadata/" + options.track_id;
  return Helper.createHttpPromise(undefined, _serviceURL, false, "GET", undefined, headers);
}

/**
 * To get the missing fields after login, call **getMissingFields()**.
 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/aappczju1t3uh-precheck-information for more details.
 * @example
 * ```js
 * const trackId = "your track id from login";
 * cidaas.getMissingFields(trackId)
 *   .then(function (response) {
 *     // type your code here
 * })
 *   .catch(function (ex) {
 *     // your failure code here
 * });
 * ```
 */
export function getMissingFields(trackId: string, headers?: HTTPRequestHeader) {
  const _serviceURL = window.webAuthSettings.authority + "/token-srv/prelogin/metadata/" + trackId;
  return Helper.createHttpPromise(undefined, _serviceURL, false, "GET", undefined, headers);
}

/**
 * To initiate device code, call **initiateDeviceCode()**.
 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/b6d284f55be5e-authorization-request for more details.
 * @example 
 * ```js
 * const clientId = "your client id";
 * cidaas.initiateDeviceCode(clientId)
 *   .then(function (response) {
 *     // type your code here
 * })
 *   .catch(function (ex) {
 *     // your failure code here
 * });
 * ```
 */
export function initiateDeviceCode(clientId?: string) {
  const clientid = clientId ?? window.webAuthSettings.client_id;
  const _serviceURL = `${window.webAuthSettings.authority}/authz-srv/device/authz?client_id=${clientid}`;
  return Helper.createHttpPromise(undefined, _serviceURL, false, "GET");
}

/**
 * To verify device code, call **deviceCodeVerify()**. 
 * @example 
 * ```js
 * const code = "your code which has been send after initiateDeviceCode()";
 * cidaas.deviceCodeVerify(code)
 *   .then(function (response) {
 *     // type your code here
 * })
 *   .catch(function (ex) {
 *     // your failure code here
 * });
 * ```
 */
export function deviceCodeVerify(code: string) {
  const params = `user_code=${encodeURI(code)}`;
  const url = `${window.webAuthSettings.authority}/token-srv/device/verify?${params}`;
  try {
    const options = {
      user_code: encodeURI(code)
    }
    const form = Helper.createForm(url, options, 'GET');
    document.body.appendChild(form);
    form.submit();
  } catch (ex) {
    throw new Error(String(ex));
  }
}

/**
 * To check access token without having to call cidaas api, call **offlineTokenCheck()**. THe function will return true if the token is valid & false if the token is invalid.
 * @example
 * ```js
 * cidaas.offlineTokenCheck('your access token');
 * ```
 */
export function offlineTokenCheck(accessToken: string) {
  const result = {
    isExpiryDateValid: false,
    isScopesValid: false,
    isIssuerValid: false,
  }
  const accessTokenHeaderAsJson: TokenHeader = JwtHelper.decodeTokenHeader(accessToken);
  const accessTokenAsJson: TokenClaim = JwtHelper.decodeToken(accessToken);
  if (!accessTokenAsJson || !accessTokenHeaderAsJson) {
    return result;
  } else {
    if (accessTokenAsJson.exp) {
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(accessTokenAsJson.exp);
      result.isExpiryDateValid = expirationDate.valueOf() > new Date().valueOf();
    }
    const accessTokenScopes: string[] = accessTokenAsJson.scopes;
    const webAuthSettingScopes: string[] = window.webAuthSettings?.scope?.split(' ');
    if (accessTokenScopes?.length === webAuthSettingScopes?.length) {
      webAuthSettingScopes.forEach(webAuthSettingScope => {
        const i = accessTokenScopes.indexOf(webAuthSettingScope);
        if (i > -1) {
          accessTokenScopes.splice(i, 1);
        }
      });
      result.isScopesValid = accessTokenScopes.length === 0;
    }
    result.isIssuerValid = accessTokenAsJson.iss === window.webAuthSettings.authority
  }

  return result;
}
