"use strict";
exports.__esModule = true;
exports.UserService = void 0;
var Helper_1 = require("./Helper");
var UserService;
(function (UserService) {
    /**
     * get user info
     * @param options
     * @returns
     */
    function getUserProfile(options) {
        /*return new Promise((resolve, reject) => {
          try {
            if (!options.access_token) {
              throw new CustomException("access_token cannot be empty", 417);
            }
            var http = new XMLHttpRequest();
            var _serviceURL = window.webAuthSettings.authority + "/users-srv/userinfo";
            http.onreadystatechange = function () {
              if (http.readyState == 4) {
                resolve(JSON.parse(http.responseText));
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
        });*/
        if (!options.access_token) {
            throw new Helper_1.CustomException("access_token cannot be empty", 417);
        }
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/userinfo";
        return Helper_1.Helper.createPostPromise(undefined, _serviceURL, undefined, "GET", options.access_token);
    }
    UserService.getUserProfile = getUserProfile;
    ;
    /**
     * register user
     * @param options
     * @param headers
     * @returns
     */
    function register(options, headers) {
        return new Promise(function (resolve, reject) {
            try {
                var http = new XMLHttpRequest();
                var _serviceURL = window.webAuthSettings.authority + "/users-srv/register";
                if (options.invite_id) {
                    _serviceURL = _serviceURL + "?invite_id=" + options.invite_id;
                }
                http.onreadystatechange = function () {
                    if (http.readyState == 4) {
                        if (http.responseText) {
                            resolve(JSON.parse(http.responseText));
                        }
                        else {
                            resolve(false);
                        }
                    }
                };
                http.open("POST", _serviceURL, true);
                http.setRequestHeader("Content-type", "application/json");
                http.setRequestHeader("requestId", headers.requestId);
                if (headers.captcha) {
                    http.setRequestHeader("captcha", headers.captcha);
                }
                if (headers.acceptlanguage) {
                    http.setRequestHeader("accept-language", headers.acceptlanguage);
                }
                else if (window.localeSettings) {
                    http.setRequestHeader("accept-language", window.localeSettings);
                }
                if (headers.bot_captcha_response) {
                    http.setRequestHeader("bot_captcha_response", headers.bot_captcha_response);
                }
                if (headers.trackId) {
                    http.setRequestHeader("trackid", headers.trackId);
                }
                http.send(JSON.stringify(options));
            }
            catch (ex) {
                reject(ex);
            }
        });
    }
    UserService.register = register;
    ;
    /**
     * get invite info
     * @param options
     * @returns
     */
    function getInviteUserDetails(options) {
        /*return new Promise((resolve, reject) => {
          try {
            var http = new XMLHttpRequest();
            var _serviceURL = window.webAuthSettings.authority + "/users-srv/invite/info/" + options.invite_id;
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
        });*/
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/invite/info/" + options.invite_id;
        return Helper_1.Helper.createPostPromise(undefined, _serviceURL, false, "GET");
    }
    UserService.getInviteUserDetails = getInviteUserDetails;
    ;
    /**
     * get Communication status
     * @param options
     * @returns
     */
    function getCommunicationStatus(options) {
        return new Promise(function (resolve, reject) {
            try {
                var http = new XMLHttpRequest();
                var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/communication/status/" + options.sub;
                http.onreadystatechange = function () {
                    if (http.readyState == 4) {
                        if (http.responseText) {
                            resolve(JSON.parse(http.responseText));
                        }
                        else {
                            resolve(false);
                        }
                    }
                };
                http.open("GET", _serviceURL, true);
                http.setRequestHeader("Content-type", "application/json");
                if (options.requestId) {
                    http.setRequestHeader("requestId", options.requestId);
                }
                if (window.localeSettings) {
                    http.setRequestHeader("accept-language", window.localeSettings);
                }
                http.send();
            }
            catch (ex) {
                reject(ex);
            }
        });
        /*
        const _serviceURL = window.webAuthSettings.authority + "/users-srv/user/communication/status/" + options.sub;
        return Helper.createPostPromise(options, _serviceURL,false, "GET", undefined);
         */
    }
    UserService.getCommunicationStatus = getCommunicationStatus;
    ;
    /**
     * initiate reset password
     * @param options
     * @returns
     */
    function initiateResetPassword(options) {
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/resetpassword/initiate";
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, "POST");
    }
    UserService.initiateResetPassword = initiateResetPassword;
    ;
    /**
     * handle reset password
     * @param options
     */
    function handleResetPassword(options) {
        try {
            var url = window.webAuthSettings.authority + "/users-srv/resetpassword/validatecode";
            if (window.webAuthSettings.cidaas_version > 2) {
                var form = Helper_1.Helper.createForm(url, options);
                document.body.appendChild(form);
                form.submit();
            }
            else {
                /*return new Promise(function (resolve, reject) {
                  try {
                    var http = new XMLHttpRequest();
                    http.onreadystatechange = function () {
                      if (http.readyState == 4) {
                        if (http.responseText) {
                          resolve(JSON.parse(http.responseText));
                        } else {
                          resolve(false);
                        }
                      }
                    };
                    http.open("POST", url, true);
                    http.setRequestHeader("Content-type", "application/json");
                    http.send(JSON.stringify(options));
                  } catch (ex) {
                    reject(ex);
                  }
                });*/
                return Helper_1.Helper.createPostPromise(options, url, false, "POST");
            }
        }
        catch (ex) {
            throw new Helper_1.CustomException(ex, 417);
        }
    }
    UserService.handleResetPassword = handleResetPassword;
    ;
    /**
    * reset password
    * @param options
    */
    function resetPassword(options) {
        var url = window.webAuthSettings.authority + "/users-srv/resetpassword/accept";
        try {
            if (window.webAuthSettings.cidaas_version > 2) {
                var form = Helper_1.Helper.createForm(url, options);
                document.body.appendChild(form);
                form.submit();
            }
            else {
                /*return new Promise(function (resolve, reject) {
                  try {
                    var http = new XMLHttpRequest();
                    http.onreadystatechange = function () {
                      if (http.readyState == 4) {
                        if (http.responseText) {
                          resolve(JSON.parse(http.responseText));
                        } else {
                          resolve(false);
                        }
                      }
                    };
                    http.open("POST", url, true);
                    http.setRequestHeader("Content-type", "application/json");
                    http.send(JSON.stringify(options));
                  } catch (ex) {
                    reject(ex);
                  }
                });*/
                return Helper_1.Helper.createPostPromise(options, url, false, "POST");
            }
        }
        catch (ex) {
            throw new Helper_1.CustomException(ex, 417);
        }
    }
    UserService.resetPassword = resetPassword;
    ;
    /**
     * get Deduplication details
     * @param options
     * @returns
     */
    function getDeduplicationDetails(options) {
        /*return new Promise((resolve, reject) => {
          try {
            var http = new XMLHttpRequest();
            var _serviceURL = window.webAuthSettings.authority + "/users-srv/deduplication/info/" + options.trackId;
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
        });*/
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/deduplication/info/" + options.trackId;
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, "GET", undefined);
    }
    UserService.getDeduplicationDetails = getDeduplicationDetails;
    ;
    /**
     * deduplication login
     * @param options
     */
    function deduplicationLogin(options) {
        try {
            var form = document.createElement('form');
            form.action = window.webAuthSettings.authority + "/users-srv/deduplication/login/redirection?trackId=" + options.trackId + "&requestId=" + options.requestId + "&sub=" + options.sub;
            form.method = 'POST';
            document.body.appendChild(form);
            form.submit();
        }
        catch (ex) {
            throw new Helper_1.CustomException(ex, 417);
        }
    }
    UserService.deduplicationLogin = deduplicationLogin;
    ;
    /**
     * register Deduplication
     * @param options
     * @returns
     */
    function registerDeduplication(options) {
        /*return new Promise((resolve, reject) => {
          try {
            var http = new XMLHttpRequest();
            var _serviceURL = window.webAuthSettings.authority + "/users-srv/deduplication/register/" + options.trackId;
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
            http.send();
          } catch (ex) {
            reject(ex);
          }
        });*/
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/deduplication/register/" + options.trackId;
        return Helper_1.Helper.createPostPromise(undefined, _serviceURL, undefined, "POST");
    }
    UserService.registerDeduplication = registerDeduplication;
    ;
    /**
     * change password
     * @param options
     * @param access_token
     * @returns
     */
    function changePassword(options, access_token) {
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/changepassword";
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, "POST", access_token);
    }
    UserService.changePassword = changePassword;
    ;
    /**
     * update profile
     * @param options
     * @param access_token
     * @param sub
     * @returns
     */
    function updateProfile(options, access_token, sub) {
        /*return new Promise((resolve, reject) => {
          try {
            var http = new XMLHttpRequest();
            var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/profile/" + sub;
            http.onreadystatechange = function () {
              if (http.readyState == 4) {
                if (http.responseText) {
                  resolve(JSON.parse(http.responseText));
                } else {
                  resolve(false);
                }
              }
            };
            http.open("PUT", _serviceURL, true);
            http.setRequestHeader("Content-type", "application/json");
            http.setRequestHeader("Authorization", `Bearer ${access_token}`);
            if (window.localeSettings) {
              http.setRequestHeader("accept-language", window.localeSettings);
            }
            http.send(JSON.stringify(options));
          } catch (ex) {
            throw new CustomException(ex, 417);
          }
        });*/
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/profile/" + sub;
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, "PUT", access_token);
    }
    UserService.updateProfile = updateProfile;
    ;
    /**
     * initiate link accoount
     * @param options
     * @param access_token
     * @returns
     */
    function initiateLinkAccount(options, access_token) {
        options.user_name_type = 'email';
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/link/initiate";
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, "POST", access_token);
    }
    UserService.initiateLinkAccount = initiateLinkAccount;
    ;
    /**
     * complete link accoount
     * @param options
     * @param access_token
     * @returns
     */
    function completeLinkAccount(options, access_token) {
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/link/complete";
        return Helper_1.Helper.createPostPromise(options, _serviceURL, false, "POST", access_token);
    }
    UserService.completeLinkAccount = completeLinkAccount;
    ;
    /**
     * get linked users
     * @param access_token
     * @param sub
     * @returns
     */
    function getLinkedUsers(access_token, sub) {
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/userinfo/social/" + sub;
        return Helper_1.Helper.createPostPromise(undefined, _serviceURL, false, "POST", access_token);
    }
    UserService.getLinkedUsers = getLinkedUsers;
    ;
    /**
     * unlink accoount
     * @param access_token
     * @param identityId
     * @returns
     */
    function unlinkAccount(access_token, identityId) {
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/unlink/" + identityId;
        return Helper_1.Helper.createPostPromise(undefined, _serviceURL, false, "POST", access_token);
    }
    UserService.unlinkAccount = unlinkAccount;
    ;
    /**
     * deleteUserAccount
     * @param options
     * @returns
     */
    function deleteUserAccount(options) {
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/unregister/scheduler/schedule/" + options.sub;
        return Helper_1.Helper.createPostPromise(options, _serviceURL, undefined, "POST", options.access_token);
    }
    UserService.deleteUserAccount = deleteUserAccount;
    ;
    /**
     * check if an user exists
     * @param options
     * @returns
     */
    function userCheckExists(options) {
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/checkexists/" + options.requestId;
        return Helper_1.Helper.createPostPromise(options, _serviceURL, undefined, "POST");
    }
    UserService.userCheckExists = userCheckExists;
    ;
})(UserService = exports.UserService || (exports.UserService = {}));
