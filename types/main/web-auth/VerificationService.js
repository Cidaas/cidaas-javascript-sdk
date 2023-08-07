"use strict";
exports.__esModule = true;
exports.VerificationService = void 0;
var Helper_1 = require("./Helper");
var VerificationService;
(function (VerificationService) {
    /**
       * initiate verification
       * @param options
       * @returns
       */
    function initiateAccountVerification(options) {
        try {
            var url = window.webAuthSettings.authority + "/verification-srv/account/initiate";
            var form = Helper_1.Helper.createForm(url, options);
            document.body.appendChild(form);
            form.submit();
        }
        catch (ex) {
            throw new Helper_1.CustomException(ex, 417);
        }
    }
    VerificationService.initiateAccountVerification = initiateAccountVerification;
    ;
    /**
     * initiate verification and return response
     * @param options
     * @returns
     */
    function initiateAccountVerificationAsynFn(options) {
        try {
            var searchParams = new URLSearchParams(options);
            var response = fetch(window.webAuthSettings.authority + "/verification-srv/account/initiate", {
                method: "POST",
                redirect: "follow",
                body: searchParams.toString(),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            return response;
        }
        catch (ex) {
            throw new Helper_1.CustomException(ex, 417);
        }
    }
    VerificationService.initiateAccountVerificationAsynFn = initiateAccountVerificationAsynFn;
    ;
    /**
     * verify account
     * @param options
     * @returns
     */
    function verifyAccount(options) {
        var _serviceURL = window.webAuthSettings.authority + "/verification-srv/account/verify";
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, "POST");
    }
    VerificationService.verifyAccount = verifyAccount;
    ;
    /**
     * get mfa list v2
     * @param options
     * @returns
     */
    function getMFAListV2(options) {
        var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/public/configured/list";
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, "POST");
    }
    VerificationService.getMFAListV2 = getMFAListV2;
    ;
    /**
     * cancel mfa v2
     * @param options
     * @returns
     */
    function cancelMFAV2(options) {
        var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/cancel/" + options.type;
        return Helper_1.Helper.createPostPromise(options, _serviceURL, undefined, "POST");
    }
    VerificationService.cancelMFAV2 = cancelMFAV2;
    ;
    /**
     * @param access_token
     * @returns
     */
    function getAllVerificationList(access_token) {
        var _serviceURL = "".concat(window.webAuthSettings.authority, "/verification-srv/config/list");
        return Helper_1.Helper.createPostPromise(undefined, _serviceURL, undefined, "GET", access_token);
    }
    VerificationService.getAllVerificationList = getAllVerificationList;
    ;
    /**
     * enrollVerification
     * @param options
     * @returns
     */
    function enrollVerification(options) {
        var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/enroll/" + options.verification_type;
        return Helper_1.Helper.createPostPromise(options, _serviceURL, undefined, "POST");
    }
    VerificationService.enrollVerification = enrollVerification;
    ;
    /**
     * @deprecated This function is no longer supported, instead use {this.updateStatus()}
     * @param status_id
     * @returns
     */
    function updateSocket(status_id) {
        var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/notification/status/" + status_id;
        return Helper_1.Helper.createPostPromise(undefined, _serviceURL, undefined, "POST");
    }
    VerificationService.updateSocket = updateSocket;
    ;
    /**
     * update the status of notification
     * @param status_id
     * @returns
     */
    function updateStatus(status_id) {
        var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/notification/status/" + status_id;
        return Helper_1.Helper.createPostPromise(undefined, _serviceURL, undefined, "POST");
    }
    VerificationService.updateStatus = updateStatus;
    ;
    /**
     * setupFidoVerification
     * @param options
     * @returns
     */
    function setupFidoVerification(options) {
        var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/initiate/suggestmfa/" + options.verification_type;
        return Helper_1.Helper.createPostPromise(options, _serviceURL, undefined, "POST");
    }
    VerificationService.setupFidoVerification = setupFidoVerification;
    ;
    /**
     * checkVerificationTypeConfigured
     * @param options
     * @returns
     */
    function checkVerificationTypeConfigured(options) {
        var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/public/configured/check/" + options.verification_type;
        return Helper_1.Helper.createPostPromise(options, _serviceURL, undefined, "POST");
    }
    VerificationService.checkVerificationTypeConfigured = checkVerificationTypeConfigured;
    ;
    /**
     * initiate mfa v2
     * @param options
     * @returns
     */
    function initiateMFAV2(options) {
        var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/initiate/" + options.type;
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, "POST");
    }
    VerificationService.initiateMFAV2 = initiateMFAV2;
    ;
    /**
     * @deprecated
     * @param options
     * @param verificationType
     * @returns
     */
    function initiateMfaV1(options, verificationType) {
        var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + verificationType.toLowerCase() + "/initiate";
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, "POST");
    }
    VerificationService.initiateMfaV1 = initiateMfaV1;
    /**
     * authenticate mfa v2
     * @param options
     * @returns
     */
    function authenticateMFAV2(options) {
        var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/authenticate/" + options.type;
        return Helper_1.Helper.createPostPromise(options, _serviceURL, undefined, "POST");
    }
    VerificationService.authenticateMFAV2 = authenticateMFAV2;
    ;
    /**
     * authenticateVerification form type (for face)
     * @param options
     * @returns
     */
    function authenticateFaceVerification(options) {
        return new Promise(function (resolve, reject) {
            try {
                var http = new XMLHttpRequest();
                var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/authenticate/face";
                http.onreadystatechange = function () {
                    if (http.readyState == 4) {
                        if (http.responseText) {
                            resolve(JSON.parse(http.responseText));
                        }
                        else {
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
            }
            catch (ex) {
                reject(ex);
            }
        });
    }
    VerificationService.authenticateFaceVerification = authenticateFaceVerification;
    ;
    /**
     * @deprecated
     * setup verification - v1
     * @param options
     * @param access_token
     * @param verificationType
     * @returns
     */
    function setupVerificationV1(options, access_token, verificationType) {
        var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + verificationType.toLowerCase() + "/setup";
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, "POST", access_token);
    }
    VerificationService.setupVerificationV1 = setupVerificationV1;
    /**
     * @deprecated
     * enroll verification - v1
     * @param options
     * @param access_token
     * @param verificationType
     * @returns
     */
    function enrollVerificationV1(options, access_token, verificationType) {
        var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + verificationType.toLowerCase() + "/enroll";
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, "POST", access_token);
    }
    VerificationService.enrollVerificationV1 = enrollVerificationV1;
    /**
     * @deprecated
     * authenticate mfa - v1
     * @param verificationType
     * @returns
     */
    function authenticateMfaV1(options, verificationType) {
        var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + verificationType.toLowerCase() + "/authenticate";
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, "POST");
    }
    VerificationService.authenticateMfaV1 = authenticateMfaV1;
})(VerificationService = exports.VerificationService || (exports.VerificationService = {}));
