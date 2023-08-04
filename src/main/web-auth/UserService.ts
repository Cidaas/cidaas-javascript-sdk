import {
  UserEntity,
  ResetPasswordEntity,
  FindUserEntity,
  IUserLinkEntity,
  ChangePasswordEntity,
  ValidateResetPasswordEntity,
  AcceptResetPasswordEntity,
} from "./Entities"
import { Helper, CustomException } from "./Helper";

export namespace UserService {

  /**
   * get user info
   * @param options 
   * @returns 
   */
  export function getUserProfile(options: { access_token: string }) {
    return new Promise((resolve, reject) => {
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
    });
  };

  /**
   * register user
   * @param options 
   * @param headers 
   * @returns 
   */
  export function register(options: UserEntity, headers: {
    requestId: string;
    captcha?: string;
    acceptlanguage?: string;
    bot_captcha_response?: string;
    trackId?: string;
  }) {
    return new Promise((resolve, reject) => {
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
            } else {
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
        } else if (window.localeSettings) {
          http.setRequestHeader("accept-language", window.localeSettings);
        }
        if (headers.bot_captcha_response) {
          http.setRequestHeader("bot_captcha_response", headers.bot_captcha_response);
        }
        if (headers.trackId) {
          http.setRequestHeader("trackid", headers.trackId);
        }
        http.send(JSON.stringify(options));
      } catch (ex) {
        reject(ex);
      }
    });
  };

  /**
   * get invite info
   * @param options 
   * @returns 
   */
  export function getInviteUserDetails(options: { invite_id: string }) {
    return new Promise((resolve, reject) => {
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
    });
  };

  /**
   * get Communication status
   * @param options 
   * @returns 
   */
  export function getCommunicationStatus(options: { sub: string, requestId: string }) {
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/communication/status/" + options.sub;
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
        if (options.requestId) {
          http.setRequestHeader("requestId", options.requestId);
        }
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
   * initiate reset password
   * @param options 
   * @returns 
   */
  export function initiateResetPassword(options: ResetPasswordEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/resetpassword/initiate";
    return Helper.createPostPromise(options, _serviceURL, false, "POST");
  };

  /**
   * handle reset password
   * @param options 
   */
  export function handleResetPassword(options: ValidateResetPasswordEntity) {
    try {
      const url = window.webAuthSettings.authority + "/users-srv/resetpassword/validatecode";
      if (window.webAuthSettings.cidaas_version > 2) {
        let form = Helper.createForm(url, options)
        document.body.appendChild(form);
        form.submit();
      } else {
        return new Promise(function (resolve, reject) {
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
        });
      }
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
  * reset password
  * @param options 
  */
  export function resetPassword(options: AcceptResetPasswordEntity) {
    const url = window.webAuthSettings.authority + "/users-srv/resetpassword/accept";
    try {
      if (window.webAuthSettings.cidaas_version > 2) {
        let form = Helper.createForm(url, options)
        document.body.appendChild(form);
        form.submit();
      } else {
        return new Promise(function (resolve, reject) {
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
        });
      }
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * get Deduplication details
   * @param options 
   * @returns 
   */
  export function getDeduplicationDetails(options: { trackId: string }) {
    return new Promise((resolve, reject) => {
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
    });
  };

  /**
   * deduplication login
   * @param options 
   */
  export function deduplicationLogin(options: { trackId: string, requestId: string, sub: string }) {
    try {
      var form = document.createElement('form');
      form.action = window.webAuthSettings.authority + "/users-srv/deduplication/login/redirection?trackId=" + options.trackId + "&requestId=" + options.requestId + "&sub=" + options.sub;
      form.method = 'POST';
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * register Deduplication
   * @param options 
   * @returns 
   */
  export function registerDeduplication(options: { trackId: string }) {
    return new Promise((resolve, reject) => {
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
    });
  };

  /**
   * change password
   * @param options 
   * @param access_token 
   * @returns 
   */
  export function changePassword(options: ChangePasswordEntity, access_token: string) {
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/changepassword";
    return Helper.createPostPromise(options, _serviceURL, false,"POST", access_token);
  };

  /**
   * update profile
   * @param options 
   * @param access_token 
   * @param sub 
   * @returns 
   */
  export function updateProfile(options: UserEntity, access_token: string, sub: string) {
    return new Promise((resolve, reject) => {
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
    });
  };

  /**
   * initiate link accoount
   * @param options 
   * @param access_token 
   * @returns 
   */
  export function initiateLinkAccount(options: IUserLinkEntity, access_token: string) {
    options.user_name_type = 'email';
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/link/initiate";
    return Helper.createPostPromise(options, _serviceURL, false, "POST", access_token);
  };

  /**
   * complete link accoount
   * @param options 
   * @param access_token 
   * @returns 
   */
  export function completeLinkAccount(options: { code?: string; link_request_id?: string; }, access_token: string) {
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/link/complete";
    return Helper.createPostPromise(options, _serviceURL, false, "POST", access_token);
  };

  /**
   * get linked users
   * @param access_token 
   * @param sub 
   * @returns 
   */
  export function getLinkedUsers(access_token: string, sub: string) {
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/userinfo/social/" + sub;
    return Helper.createPostPromise(undefined, _serviceURL, false, "POST", access_token);
  };

  /**
   * unlink accoount
   * @param access_token 
   * @param identityId 
   * @returns 
   */
  export function unlinkAccount(access_token: string, identityId: string) {
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/unlink/" + identityId;
    return Helper.createPostPromise(undefined, _serviceURL, false, "POST", access_token);
  };

  /**
   * deleteUserAccount
   * @param options 
   * @returns 
   */
  export function deleteUserAccount(options: { access_token: string, sub: string }) {
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/unregister/scheduler/schedule/" + options.sub;
    return Helper.createPostPromise(options, _serviceURL, undefined, "POST", options.access_token);
  };


  /**
   * check if an user exists
   * @param options 
   * @returns 
   */
  export function userCheckExists(options: FindUserEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/checkexists/" + options.requestId;
    return Helper.createPostPromise(options, _serviceURL, undefined, "POST");
  };
}
