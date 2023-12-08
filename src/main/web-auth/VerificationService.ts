import {
  IConfiguredListRequestEntity,
  IInitVerificationAuthenticationRequestEntity,
  IEnrollVerificationSetupRequestEntity,
  IAuthVerificationAuthenticationRequestEntity,
  AccountVerificationRequestEntity,
} from "./Entities"
import { Helper, CustomException } from "./Helper";

export namespace VerificationService {
  /**
     * To initiate the account verification, call **initiateAccountVerification()**. This will send verification code  email or sms or ivr based on the verificationMedium you mentioned.
     * @example
     * ```js
     * cidaas.initiateAccountVerification({
     *   verificationMedium: 'email',
     *   requestId: 'your requestId',
     *   processingType: 'CODE', 
     *   email: 'your email'
     * }).then(function (response) {
     *   // the response will give you account verification details.
     * }).catch(function(ex) {
     *   // your failure code here
     * });
     * ```
     */
  export function initiateAccountVerification(options: AccountVerificationRequestEntity) {
    try {
      const url = window.webAuthSettings.authority + "/verification-srv/account/initiate";
      let form = Helper.createForm(url, options)
      document.body.appendChild(form);
      form.submit();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  };

  /**
   * To complete the verification, call **verifyAccount()**. 
   * @example
   * ```js
   * cidaas.verifyAccount({
   *   accvid: 'your accvid', // which you will get on initiate account verification response
   *   code: 'your code in email or sms or ivr'
   * }).then(function (response) {
   *   // the response will give you account verification ID and unique code.
   * }).catch(function(ex) {
   *   // your failure code here
   * });
   * ```
   */
  export function verifyAccount(options: {
    accvid: string;
    code: string;
  }) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/account/verify";
    return Helper.createHttpPromise(options, _serviceURL, false, "POST");
  };

  /**
   * To get all configured multi factor authentication, call **getMFAList()**. 
   * @example
   * ```js
   * cidaas.getMFAList({
   *   request_id: 'your request id',
   *   email: 'your email'
   * }).then(function (response) {
   *   // the response will give you list of configured multi factor authentication
   * }).catch(function(ex) {
   *   // your failure code here
   * });
   * ```
   */
  export function getMFAList(options: IConfiguredListRequestEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/public/configured/list";
    return Helper.createHttpPromise(options, _serviceURL, false, "POST");
  };

  /**
   * to cancel mfa process, call **cancelMFA()**. 
   * @example
   * ```js
   * cidaas.cancelMFA({
   *   exchange_id: 'exchange id from initiateMFA() response',
   *   reason: 'reason of mfa cancelation',
   *   type: 'authentication type e.g. email'
   * }).then(function (response) {
   *   // your success code here
   * }).catch(function(ex) {
   *   // your failure code here
   * });
   * ```
   */
  export function cancelMFA(options: {
    exchange_id: string;
    reason: string;
    type: string;
  }) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/cancel/" + options.type;
    return Helper.createHttpPromise(options, _serviceURL, undefined, "POST");
  };

  /**
   * To get list of all verification type configured, call **getAllVerificationList()**. access_token must be passed as function parameter.
   * @example
   * ```js
   * const access_token = "your access token";
   * 
   * cidaas.getAllVerificationList(access_token)
   * .then(function (response) {
   *   // type your code here
   * })
   * .catch(function (ex) {
   *   // your failure code here
   * });
   * ```
   */
  export function getAllVerificationList(access_token: string) {
    const _serviceURL = `${window.webAuthSettings.authority}/verification-srv/config/list`;
    return Helper.createHttpPromise(undefined, _serviceURL, undefined, "GET", access_token);
  };

  /**
   * To initiate enrollment of new multi factor authentication, call **initiateEnrollment()**.
   * @example
   * ```js
   * const access_token = "your access token";
   * const options = {
   *   verification_type: 'one of verification_type such as fido2, face, ivr',
   *   deviceInfo: {
   *    deviceId: '', 
   *    location: {lat: '', lon: ''}
   *  }
   * }
   * 
   * cidaas.initiateEnrollment(options, access_token)
   * .then(function (response) {
   *   // type your code here
   * })
   * .catch(function (ex) {
   *   // your failure code here
   * });
   * ```
   */
  export function initiateEnrollment(options: {
    verification_type: string,
    deviceInfo?: {
      deviceId: string,
      location: {
        lat: string,
        lon: string
      }
    }
  }, accessToken: string) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/initiate/" + options.verification_type;
    return Helper.createHttpPromise(options, _serviceURL, undefined, "POST", accessToken);
  };

  /**
   * to get the status of MFA enrollment, call **getEnrollmentStatus**.
   * @example
   * ```js
   * cidaas.getEnrollmentStatus('statusId from initiateEnrollment()', 'your access token')
   * .then(function (response) {
   *   // type your code here
   * })
   * .catch(function (ex) {
   *   // your failure code here
   * });
   * ```
  */
  export function getEnrollmentStatus(status_id: string, accessToken: string) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/notification/status/" + status_id;
    return Helper.createHttpPromise(undefined, _serviceURL, undefined, "POST", accessToken);
  };

  /**
   * to finish enrollment process of new multi factor authentication, call **enrollVerification**.
   * @example
   * ```js
   * const fidoPayload = {
   *   sub: 'your sub',
   *   exchange_id: 'exchange_id from initiateEnrollment()',
   *   verification_type: 'fido2',
   *   fido2_client_response: {
   *     client_response: 'client_response from doing fido process',
   *     fidoRequestId: 'fidoRequestId from initiateEnrollment',
   *   }
   * }
   * cidaas.enrollVerification(fidoPayload)
   * .then(function (response) {
   *   // type your code here
   * })
   * .catch(function (ex) {
   *   // your failure code here
   * });
   * ```
   */
  export function enrollVerification(options: IEnrollVerificationSetupRequestEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/enroll/" + options.verification_type;
    return Helper.createHttpPromise(options, _serviceURL, undefined, "POST");
  };

  /**
   * to see details of configured verification type, call **checkVerificationTypeConfigured**.
   * @example
   * ```js
   * cidaas.checkVerificationTypeConfigured({
   *   request_id: 'your request id',
   *   email: 'your email',
   *   verification_type: 'email'
   * }).then(function (response) {
   *   // type your code here
   * })
   * .catch(function (ex) {
   *   // your failure code here
   * });
   * ```
   */
  export function checkVerificationTypeConfigured(options: IConfiguredListRequestEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/public/configured/check/" + options.verification_type;
    return Helper.createHttpPromise(options, _serviceURL, undefined, "POST");
  };

  /**
   * to initiate multi factor auhentication, call **initiateMFA**.
   * @example
   * ```js
   * const access_token = "your access token";
   * const options = {
   *   request_id: 'your request id',
   *   usage_type: 'PASSWORDLESS_AUTHENTICATION',
   *   type: 'email'
   *   email: 'your email'
   *  }
   * }
   * 
   * cidaas.initiateMFA(options, access_token)
   * .then(function (response) {
   *   // type your code here
   * })
   * .catch(function (ex) {
   *   // your failure code here
   * });
   * ```
   */
  export function initiateMFA(options: IInitVerificationAuthenticationRequestEntity, accessToken: string) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/initiate/" + options.type;
    return Helper.createHttpPromise(options, _serviceURL, false, "POST", accessToken);
  };

  /**
   * to authenticate with multi factor auhentication, call **authenticateMFA**.
    * @example
   * ```js
   * cidaas.authenticateMFA({
   *   type: 'email',
   *   client_id: 'your client id',
   *   exchange_id: exchange id from initiateMFA(),
   *   pass_code: 'code to authenticate'
   * }).then(function (response) {
   *   // type your code here
   * })
   * .catch(function (ex) {
   *   // your failure code here
   * });
   * ```
   */
  export function authenticateMFA(options: IAuthVerificationAuthenticationRequestEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/authenticate/" + options.type;
    return Helper.createHttpPromise(options, _serviceURL, undefined, "POST");
  };

}
