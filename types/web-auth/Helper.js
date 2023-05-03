"use strict";
exports.__esModule = true;
exports.CustomException = exports.Helper = void 0;
var Helper = /** @class */ (function () {
    function Helper() {
    }
    /**
   * create form
   * @param form
   * @param options
   * @returns
   */
    Helper.createForm = function (url, options, method) {
        if (method === void 0) { method = 'POST'; }
        var form = document.createElement('form');
        form.action = url;
        form.method = method;
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", options[key]);
                form.appendChild(hiddenField);
            }
        }
        return form;
    };
    /**
    * utility function to create and make post request
    * @param options
    * @param serviceurl
    * @param errorResolver
    * @param access_token
    * @param headers
    * @returns
    */
    Helper.createPostPromise = function (options, serviceurl, errorResolver, access_token, headers) {
        return new Promise(function (resolve, reject) {
            try {
                var http = new XMLHttpRequest();
                http.onreadystatechange = function () {
                    if (http.readyState == 4) {
                        if (http.responseText) {
                            resolve(JSON.parse(http.responseText));
                        }
                        else {
                            resolve(errorResolver);
                        }
                    }
                };
                http.open("POST", serviceurl, true);
                http.setRequestHeader("Content-type", "application/json");
                if (headers) {
                    for (var key in headers) {
                        if (headers.hasOwnProperty(key)) {
                            http.setRequestHeader(key, headers[key]);
                        }
                    }
                }
                if (access_token) {
                    http.setRequestHeader("Authorization", "Bearer ".concat(access_token));
                }
                if (window.localeSettings) {
                    http.setRequestHeader("accept-language", window.localeSettings);
                }
                if (options) {
                    http.send(JSON.stringify(options));
                }
                else {
                    http.send();
                }
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    return Helper;
}());
exports.Helper = Helper;
var CustomException = /** @class */ (function () {
    function CustomException(errorMessage, statusCode) {
        this.errorMessage = errorMessage;
        this.statusCode = statusCode;
    }
    return CustomException;
}());
exports.CustomException = CustomException;
