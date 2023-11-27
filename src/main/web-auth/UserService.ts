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
   * get user info , call **getUserProfile()**.
   * @example
   * ```js
   * this.cidaas.getUserProfile({
   *   access_token: 'access_token id'
   * })
   * .then(function (response) {
   *  // type your code here
   * })
   * .catch(function (ex) {
   *  // your failure code here
   * });
   * ```
   */
  export function getUserProfile(options: { access_token: string }) {
    if (!options.access_token) {
      throw new CustomException("access_token cannot be empty", 417);
    }
    const _serviceURL = window.webAuthSettings.authority + "/users-srv/userinfo";
    return Helper.createPostPromise(undefined, _serviceURL, false, "GET", options.access_token);
  };

  /**
   * register user , call **register()**.
   * @example
   * ```js
   * this.cidaas.register(options: UserEntity, headers: {
    requestId: string;
    captcha?: string;
    acceptlanguage?: string;
    bot_captcha_response?: string;
    trackId?: string;
  })
   * .then(function (response) {
   *  // type your code here
   * })
   * .catch(function (ex) {
   *  // your failure code here
   * });
   * ```
   */

  export function register(options: UserEntity, headers: {
    requestId: string;
    captcha?: string;
    acceptlanguage?: string;
    bot_captcha_response?: string;
    trackId?: string;
  }){
    console.log("header", headers)
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/register";
    if (options.invite_id) {
      _serviceURL = _serviceURL + "?invite_id=" + options.invite_id;
    }
    return Helper.createPostPromise(options, _serviceURL, false, "POST", undefined, headers);
  };

   /**
   * get invite user details , call **getInviteUserDetails()**.
   * @example
   * ```js
   * this.cidaas.getInviteUserDetails(options: {
    invite_id: 'invite_id'
  })
   * .then(function (response) {
   *  // type your code here
   * })
   * .catch(function (ex) {
   *  // your failure code here
   * });
   * ```
   */

  export function getInviteUserDetails(options: { invite_id: string }) {
    const _serviceURL = window.webAuthSettings.authority + "/users-srv/invite/info/" + options.invite_id;
    return Helper.createPostPromise(undefined, _serviceURL, false, "GET");
  };

  /**
   * get Communication status
   * @param options 
   * @returns 
   */

  /**
   * get Communication status , call **getCommunicationStatus()**.
   * @example
   * ```js
   * this.cidaas.getCommunicationStatus(options: {
    sub: 'sub ',
    requestId" 'requestId'
  })
   * .then(function (response) {
   *  // type your code here
   * })
   * .catch(function (ex) {
   *  // your failure code here
   * });
   * ```
   */

  export function getCommunicationStatus(options: { sub: string, requestId: string }) {
    var headers = { requestId: options.requestId }
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/communication/status/" + options.sub;
    return Helper.createPostPromise(undefined, _serviceURL, false, "GET", undefined, headers);
  };

  /**
   * initiate reset password , call **initiateResetPassword()**.
   * @example
   * ```js
   * this.cidaas.initiateResetPassword(options: ResetPasswordEntity)
   * .then(function (response) {
   *  // type your code here
   * })
   * .catch(function (ex) {
   *  // your failure code here
   * });
   * ```
   */

  export function initiateResetPassword(options: ResetPasswordEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/resetpassword/initiate";
    return Helper.createPostPromise(options, _serviceURL, false, "POST");
  };

  /**
   * handle reset password , call **handleResetPassword()**.
   * @example
   * ```js
   * this.cidaas.handleResetPassword(options: ValidateResetPasswordEntity)
   * .then(function (response) {
   *  // type your code here
   * })
   * .catch(function (ex) {
   *  // your failure code here
   * });
   * ```
   */

  export function handleResetPassword(options: ValidateResetPasswordEntity) {
    try {
      const url = window.webAuthSettings.authority + "/users-srv/resetpassword/validatecode";
      if (window.webAuthSettings.cidaas_version > 2) {
        let form = Helper.createForm(url, options)
        document.body.appendChild(form);
        form.submit();
      } else {
        return Helper.createPostPromise(options, url, false, "POST");
      }
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * reset password , call **handleResetPassword()**.
   * @example
   * ```js
   * this.cidaas.handleResetPassword(options: AcceptResetPasswordEntity)
   * .then(function (response) {
   *  // type your code here
   * })
   * .catch(function (ex) {
   *  // your failure code here
   * });
   * ```
   */
  export function resetPassword(options: AcceptResetPasswordEntity) {
    const url = window.webAuthSettings.authority + "/users-srv/resetpassword/accept";
    try {
      if (window.webAuthSettings.cidaas_version > 2) {
        let form = Helper.createForm(url, options)
        document.body.appendChild(form);
        form.submit();
      } else {
        return Helper.createPostPromise(options, url, false, "POST");
      }
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * get Deduplication details , call **getDeduplicationDetails()**.
   * @example
   * ```js
   * this.cidaas.getDeduplicationDetails(options: {trackId:'trackId'})
   * .then(function (response) {
   *  // type your code here
   * })
   * .catch(function (ex) {
   *  // your failure code here
   * });
   * ```
   */
  export function getDeduplicationDetails(options: { trackId: string }) {
    const _serviceURL = window.webAuthSettings.authority + "/users-srv/deduplication/info/" + options.trackId;
    return Helper.createPostPromise(options, _serviceURL, false, "GET", undefined);
  };

  /**
   * deduplication login , call **deduplicationLogin()**.
   * @example
   * ```js
   * this.cidaas.deduplicationLogin(options: {trackId:'trackId', requestId: 'requestId', sub:'sub'})
   * .then(function (response) {
   *  // type your code here
   * })
   * .catch(function (ex) {
   *  // your failure code here
   * });
   * ```
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
   * deduplication register , call **registerDeduplication()**.
   * @example
   * ```js
   * this.cidaas.registerDeduplication(options: {trackId:'trackId'})
   * .then(function (response) {
   *  // type your code here
   * })
   * .catch(function (ex) {
   *  // your failure code here
   * });
   * ```
   */
  export function registerDeduplication(options: { trackId: string }) {
    const _serviceURL = window.webAuthSettings.authority + "/users-srv/deduplication/register/" + options.trackId;
    return Helper.createPostPromise(undefined, _serviceURL, false, "POST");
  };

  /**
   * change password , call **changePassword()**.
   * @example
   * ```js
   * this.cidaas.changePassword(options: {
   * sub: 'sub',
   * dentityId: 'dentityId',
   * old_password: 'old_password',
   * new_password: 'new_password',
   * confirm_password: 'confirm_password' }, access_token: 'access_token)
   * .then(function (response) {
   *  // type your code here
   * })
   * .catch(function (ex) {
   *  // your failure code here
   * });
   * ```
   */
  export function changePassword(options: ChangePasswordEntity, access_token: string) {
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/changepassword";
    return Helper.createPostPromise(options, _serviceURL, false, "POST", access_token);
  };

  /**
   * update profile , call **updateProfile()**.
   * @example
   * ```js
   * this.cidaas.updateProfile(options: {
   * email: 'testertest@widas.de',
   * given_name: 'tester',
   * family_name: 'sample',
   * password: '123456',
   * password_echo: '123456' }, access_token: 'access_token, sub:'sub')
   * .then(function (response) {
   *  // type your code here
   * })
   * .catch(function (ex) {
   *  // your failure code here
   * });
   * ```
   */

  export function updateProfile(options: UserEntity, access_token: string, sub: string) {
    const _serviceURL = window.webAuthSettings.authority + "/users-srv/user/profile/" + sub;
    return Helper.createPostPromise(options, _serviceURL, false, "PUT", access_token);
  };

  /**
   * update profile , call **initiateLinkAccount()**.
   * @example
   * ```js
   * this.cidaas.initiateLinkAccount(options: {
   * master_sub: 'sub',
   * user_name_type: 'user_name_type',
   * user_name_to_link: 'user_name_to_link',
   * }, access_token: 'access_token)
   * .then(function (response) {
   *  // type your code here
   * })
   * .catch(function (ex) {
   *  // your failure code here
   * });
   * ```
   */
  export function initiateLinkAccount(options: IUserLinkEntity, access_token: string) {
    options.user_name_type = 'email';
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/link/initiate";
    return Helper.createPostPromise(options, _serviceURL, false, "POST", access_token);
  };

  /**
   * complete link accoount , call **completeLinkAccount()**.
   * @example
   * ```js
   * this.cidaas.completeLinkAccount(options: {
   * code: 'code',
   * link_request_id: 'link_request_id'
   * }, access_token: 'access_token)
   * .then(function (response) {
   *  // type your code here
   * })
   * .catch(function (ex) {
   *  // your failure code here
   * });
   * ```
   */
  export function completeLinkAccount(options: { code?: string; link_request_id?: string; }, access_token: string) {
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/link/complete";
    return Helper.createPostPromise(options, _serviceURL, false, "POST", access_token);
  };

  /**
   * get linked users , call **getLinkedUsers()**.
   * @example
   * ```js
   * this.cidaas.getLinkedUsers(access_token, sub)
   * .then(function (response) {
   *  // type your code here
   * })
   * .catch(function (ex) {
   *  // your failure code here
   * });
   * ```
   */
  export function getLinkedUsers(access_token: string, sub: string) {
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/userinfo/social/" + sub;
    return Helper.createPostPromise(undefined, _serviceURL, false, "GET", access_token);
  };

  /**
   * unlink account , call **unlinkAccount()**.
   * @example
   * ```js
   * this.cidaas.unlinkAccount(access_token, identityId)
   * .then(function (response) {
   *  // type your code here
   * })
   * .catch(function (ex) {
   *  // your failure code here
   * });
   * ```
   */
  export function unlinkAccount(access_token: string, identityId: string) {
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/unlink/" + identityId;
    return Helper.createPostPromise(undefined, _serviceURL, false, "POST", access_token);
  };

  /**
   * deleteUserAccount , call **deleteUserAccount()**.
   * @example
   * ```js
   * this.cidaas.deleteUserAccount(access_token, sub)
   * .then(function (response) {
   *  // type your code here
   * })
   * .catch(function (ex) {
   *  // your failure code here
   * });
   * ```
   */
  export function deleteUserAccount(options: { access_token: string, sub: string }) {
    var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/unregister/scheduler/schedule/" + options.sub;
    return Helper.createPostPromise(options, _serviceURL, false, "POST", options.access_token);
  };

  /**
   * check if an user exists from users-actions-srv , call **userCheckExists()**.
   * @example
   * ```js
   * this.cidaas.userCheckExists(options: {
   *  email: 'your email',
   *  requestId: 'requestId',
   *  webfinger:'webfinger',
   *  rememberMe: 'rememberMe'
   * })
   * .then(function (response) {
   *  // type your code here
   * })
   * .catch(function (ex) {
   *  // your failure code here
   * });
   * ```
   */
  export function userCheckExists(options: FindUserEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/useractions-srv/userexistence/" + options.requestId + "?webfinger=" + options.webfinger + "&rememberMe=" + options.rememberMe;
    return Helper.createPostPromise(options, _serviceURL, false, "POST");
  };
}
