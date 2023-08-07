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
    return Helper.createPostPromise(options, _serviceURL, false,"POST");
  };

  /**
   * accept constn v2
   * @param options 
   * @returns 
   */
  export function acceptConsentV2(options: IConsentAcceptEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/usage/accept";
    return Helper.createPostPromise(options, _serviceURL, false, "POST" );
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
    const _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/versions/details/" + options.scopeid + "?locale=" + options.locale;
    return Helper.createPostPromise(undefined, _serviceURL,false, "GET", options.access_token);
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
    return Helper.createPostPromise(options, _serviceURL, false, "POST");
  };

  /**
   * accept claim Consent
   * @param options 
   * @returns 
   */
  export function acceptClaimConsent(options: { client_id: string; sub: string; accepted_claims: string[]; }) {
    var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/consent/claim/accept";
    return Helper.createPostPromise(options, _serviceURL, false,  "POST");
  };

  /**
   * revoke claim Consent
   * @param options 
   * @returns 
   */
  export function revokeClaimConsent(options: { client_id: string; sub: string; revoked_claims: string[]; }) {
    var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/consent/claim/revoke";
    return Helper.createPostPromise(options, _serviceURL, false,  "POST");
  };
}
