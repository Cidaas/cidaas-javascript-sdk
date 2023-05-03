import { IConsentAcceptEntity } from "./Entities"
import { Helper } from "./Helper";

export namespace ConsentService {
  /**
  * get user consent details
  * @param options 
  * @returns 
  */
  export function getConsentDetailsV2(options: {
    consent_id: string;
    consent_version_id: string;
    sub: string;
  }) {
    var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/usage/public/info";
    return Helper.createPostPromise(options, _serviceURL, false);
  };

  /**
   * accept constn v2
   * @param options 
   * @returns 
   */
  export function acceptConsentV2(options: IConsentAcceptEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/usage/accept";
    return Helper.createPostPromise(options, _serviceURL, false);
  };

  /**
   * get scope consent version details
   * @param options 
   * @returns 
   */
  export function getScopeConsentVersionDetailsV2(options: {
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
  export function acceptScopeConsent(options: {
    client_id: string;
    sub: string;
    scopes: string[];
  }) {
    var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/consent/scope/accept";
    return Helper.createPostPromise(options, _serviceURL, false);
  };

  /**
   * accept claim Consent
   * @param options 
   * @returns 
   */
  export function acceptClaimConsent(options: { client_id: string; sub: string; accepted_claims: string[]; }) {
    var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/consent/claim/accept";
    return Helper.createPostPromise(options, _serviceURL, false);
  };

  /**
   * revoke claim Consent
   * @param options 
   * @returns 
   */
  export function revokeClaimConsent(options: { client_id: string; sub: string; revoked_claims: string[]; }) {
    var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/consent/claim/revoke";
    return Helper.createPostPromise(options, _serviceURL, false);
  };
}
