import { IConsentAcceptEntity } from "./Entities"
import { Helper } from "./Helper";

/**
 * Consent Management
 * For the first time login, the user needs to accept the terms and conditions.
 */
export namespace ConsentService {
  /**
   * To get consent details , call **getConsentDetails()**.
   * @example
   * ```js
   * this.cidaas.getConsentDetails({
   *   consent_id: 'consent id',
   *   consent_version_id: 'consent version id',
   *   sub: 'masked sub'
   * })
   * .then(function (response) {
   *  // type your code here
   * })
   * .catch(function (ex) {
   *  // your failure code here
   * });
   * ```
   */
  export function getConsentDetails(options: {
    consent_id: string;
    consent_version_id: string;
    sub: string;
  }) {
    var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/usage/public/info";
    return Helper.createPostPromise(options, _serviceURL, false, "POST");
  };

  /**
   * To accept consent, call ****acceptConsent()****
   * @example
   * ```js
   * this.cidaas.acceptConsent({
   *   client_id: 'your client id',
   *   consent_id: 'consent id',
   *   consent_version: 'consent version id',
   *   sub: 'masked sub'
   * }).then((response) => {
   *   // the response will give you details of accepted consent.
   * }).catch((err) => {
   *   // your failure code here
   * });
   * ```
   */
  export function acceptConsent(options: IConsentAcceptEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/usage/accept";
    return Helper.createPostPromise(options, _serviceURL, false, "POST");
  };

  /**
   * To get scope consent version details, call **getScopeConsentVersionDetails**.
   * @example
   * ```js
   * this.cidaas.getScopeConsentVersionDestails({
   *   scopeid: 'scope consent id',
   *   locale: 'browser accept language or custom language',
   *   access_token: 'your access token',
   * }).then((response) => {
   *   // type your code here
   * }).catch((err) => {
   *   // your failure code here
   * });
   * ```
   */
  export function getScopeConsentVersionDetails(options: {
    scopeid: string;
    locale: string;
    access_token: string;
  }) {
    const _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/versions/details/" + options.scopeid + "?locale=" + options.locale;
    return Helper.createPostPromise(undefined, _serviceURL, false, "GET", options.access_token);
  };

  /**
   * To accept scope consent, call **acceptScopeConsent()**.
   * @example
   * ```js
   * this.cidaas.acceptScopeConsent({
   *   client_id: 'your client id',
   *   sub: 'masked sub',
   *   scopes: [your scope consents]
   *  });
   * ```
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
   * To accept Claim Consent, call ****acceptClaimConsent()****
   * @example
   * ```js
   * this.cidaas.acceptClaimConsent({
   *   client_id: 'your client id',
   *   sub: 'masked sub',
   *   accepted_claims: [your claim consents]
   *  });
   * ```
   */
  export function acceptClaimConsent(options: { client_id: string; sub: string; accepted_claims: string[]; }) {
    var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/consent/claim/accept";
    return Helper.createPostPromise(options, _serviceURL, false, "POST");
  };

  /**
   * To revoke Claim Consent, call ****revokeClaimConsent()****
   * @example
   * ```js
   * this.cidaas.revokeClaimConsent({
   *    access_token: 'your access token',
   *    client_id: 'your client id',
   *    sub: 'masked sub'
   *    revoked_claims: [your claim consents]
   *  }).then((response) => {
   *    // the response will give you revoked claim consent.
   *  }).catch((err) => {
   *    // your failure code here 
   *  });
   * ```
   */
  export function revokeClaimConsent(options: { access_token?: string; client_id: string; sub: string; revoked_claims: string[]; }) {
    var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/consent/claim/revoke";
    return Helper.createPostPromise(options, _serviceURL, false, "POST", options.access_token);
  };
}
