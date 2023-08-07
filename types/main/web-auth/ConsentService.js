"use strict";
exports.__esModule = true;
exports.ConsentService = void 0;
var Helper_1 = require("./Helper");
var ConsentService;
(function (ConsentService) {
    /**
    * get user consent details
    * @param options
    * @returns
    */
    function getConsentDetailsV2(options) {
        var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/usage/public/info";
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, "POST");
    }
    ConsentService.getConsentDetailsV2 = getConsentDetailsV2;
    ;
    /**
     * accept constn v2
     * @param options
     * @returns
     */
    function acceptConsentV2(options) {
        var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/usage/accept";
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, "POST");
    }
    ConsentService.acceptConsentV2 = acceptConsentV2;
    ;
    /**
     * get scope consent version details
     * @param options
     * @returns
     */
    function getScopeConsentVersionDetailsV2(options) {
        var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/versions/details/" + options.scopeid + "?locale=" + options.locale;
        return Helper_1.Helper.createPostPromise(undefined, _serviceURL, false, "GET", options.access_token);
    }
    ConsentService.getScopeConsentVersionDetailsV2 = getScopeConsentVersionDetailsV2;
    ;
    /**
     * accept scope Consent
     * @param options
     * @returns
     */
    function acceptScopeConsent(options) {
        var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/consent/scope/accept";
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, "POST");
    }
    ConsentService.acceptScopeConsent = acceptScopeConsent;
    ;
    /**
     * accept claim Consent
     * @param options
     * @returns
     */
    function acceptClaimConsent(options) {
        var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/consent/claim/accept";
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, "POST");
    }
    ConsentService.acceptClaimConsent = acceptClaimConsent;
    ;
    /**
     * revoke claim Consent
     * @param options
     * @returns
     */
    function revokeClaimConsent(options) {
        var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/consent/claim/revoke";
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, "POST");
    }
    ConsentService.revokeClaimConsent = revokeClaimConsent;
    ;
})(ConsentService = exports.ConsentService || (exports.ConsentService = {}));
