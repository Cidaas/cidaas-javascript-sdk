import { HTTPRequestHeader } from "../common/Common.model";
import { Helper } from "../common/Helper";
import { AcceptClaimConsentRequest, AcceptConsentRequest, AcceptScopeConsentRequest, GetConsentDetailsRequest, GetConsentVersionDetailsRequest, RevokeClaimConsentRequest } from "./ConsentService.model";

/**
 * To get consent details , call **getConsentDetails()**.
 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/858fbeb51c62b-find-consent-info for more details.
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
export function getConsentDetails(options: GetConsentDetailsRequest, headers?: HTTPRequestHeader) {
  const _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/usage/public/info";
  return Helper.createHttpPromise(options, _serviceURL, false, "POST", undefined, headers);
}

/**
 * To accept consent, call **acceptConsent()**.
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
export function acceptConsent(options: AcceptConsentRequest, headers?: HTTPRequestHeader) {
  const _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/usage/accept";
  return Helper.createHttpPromise(options, _serviceURL, false, "POST", undefined, headers);
}

/**
 * To get version details of consent, call **getConsentVersionDetails()**.
 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/7e24ac2113315-get-consent-version-details for more details.
 * @example
 * ```js
 * this.cidaas.getConsentVersionDetails({
 *   consentid: 'your consent id',
 *   locale: 'browser accept language or custom language',
 * }).then((response) => {
 *   // type your code here
 * }).catch((err) => {
 *   // your failure code here
 * });
 * ```
 */
export function getConsentVersionDetails(options: GetConsentVersionDetailsRequest, headers?: HTTPRequestHeader) {
  let _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/versions/details/" + options.consentid;
  if (options.locale) {
    _serviceURL += "?locale=" + options.locale;
  }
  return Helper.createHttpPromise(undefined, _serviceURL, false, "GET", undefined, headers);
}

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
export function acceptScopeConsent(options: AcceptScopeConsentRequest, headers?: HTTPRequestHeader) {
  const _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/consent/scope/accept";
  return Helper.createHttpPromise(options, _serviceURL, false, "POST", undefined, headers);
}

/**
 * To accept claim consent, call **acceptClaimConsent()**.
 * @example
 * ```js
 * this.cidaas.acceptClaimConsent({
 *   client_id: 'your client id',
 *   sub: 'masked sub',
 *   accepted_claims: [your claim consents]
 *  });
 * ```
 */
export function acceptClaimConsent(options: AcceptClaimConsentRequest, headers?: HTTPRequestHeader) {
  const _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/consent/claim/accept";
  return Helper.createHttpPromise(options, _serviceURL, false, "POST", undefined, headers);
}

/**
 * To revoke claim consent, call **revokeClaimConsent()**.
 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/9ae62e98842fe-revoke-user-consent-claim for more details.
 * @example
 * ```js
 * this.cidaas.revokeClaimConsent({
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
export function revokeClaimConsent(options: RevokeClaimConsentRequest) {
  const _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/consent/claim/revoke";
  if (options.access_token) {
    return Helper.createHttpPromise(options, _serviceURL, false, "POST", options.access_token);
  }
  Helper.getAccessTokenFromUserStorage().then((accessToken) => {
    return Helper.createHttpPromise(options, _serviceURL, false, "POST", accessToken);
  });
}
