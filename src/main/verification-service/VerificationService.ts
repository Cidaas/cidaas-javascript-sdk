
import { HTTPRequestHeader } from "../common/Common.model";
import { Helper, CustomException } from "../common/Helper";
import { AuthenticateMFARequest, CancelMFARequest, CheckVerificationTypeConfiguredRequest, ConfigureFriendlyNameRequest, ConfigureVerificationRequest, EnrollVerificationRequest, GetMFAListRequest, InitiateAccountVerificationRequest, InitiateEnrollmentRequest, InitiateMFARequest, InitiateVerificationRequest, VerifyAccountRequest } from "./VerificationService.model";

/**
   * To initiate the account verification, call **initiateAccountVerification()**. This will send verification code  email or sms or ivr based on the verificationMedium you mentioned.
   * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/cgans5erj5alg-init-account-verification for more details.
   * @example
   * ```js
   * cidaas.initiateAccountVerification({
   *   verificationMedium: 'email',
   *   requestId: 'your requestId',
   *   processingType: ProcessingType.CODE, 
   *   email: 'your email'
   * }).then(function (response) {
   *   // the response will give you account verification details.
   * }).catch(function(ex) {
   *   // your failure code here
   * });
   * ```
   */
export function initiateAccountVerification(options: InitiateAccountVerificationRequest) {
  try {
    const url = window.webAuthSettings.authority + "/verification-srv/account/initiate";
    const form = Helper.createForm(url, options)
    document.body.appendChild(form);
    form.submit();
  } catch (ex) {
    throw new CustomException(String(ex), 417);
  }
}

/**
 * To complete the verification, call **verifyAccount()**.
 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/r8h9mvavvw2e6-verify-account for more details.
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
export function verifyAccount(options: VerifyAccountRequest, headers?: HTTPRequestHeader) {
  const _serviceURL = window.webAuthSettings.authority + "/verification-srv/account/verify";
  return Helper.createHttpPromise(options, _serviceURL, false, "POST", undefined, headers);
}

/**
 * To get all configured multi factor authentication, call **getMFAList()**.
 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/ee688a9c52b63-list-of-configured-verification-methods for more details.
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
export function getMFAList(options: GetMFAListRequest, headers?: HTTPRequestHeader) {
  const _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/public/configured/list";
  return Helper.createHttpPromise(options, _serviceURL, false, "POST", undefined, headers);
}

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
export function cancelMFA(options: CancelMFARequest, headers?: HTTPRequestHeader) {
  const _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/cancel/" + options.type;
  return Helper.createHttpPromise(options, _serviceURL, undefined, "POST", undefined, headers);
}

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
export function getAllVerificationList(access_token: string, headers?: HTTPRequestHeader) {
  const _serviceURL = `${window.webAuthSettings.authority}/verification-srv/config/list`;
  return Helper.createHttpPromise(undefined, _serviceURL, undefined, "GET", access_token, headers);
}

/**
 * To initiate enrollment of new multi factor authentication, call **initiateEnrollment()**.
 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/branches/master/f85aef6754714-initiate-physical-verification-setup for more details.
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
export function initiateEnrollment(options: InitiateEnrollmentRequest, accessToken: string) {
  const _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/initiate/" + options.verification_type;
  return Helper.createHttpPromise(options, _serviceURL, undefined, "POST", accessToken);
}

/**
 * to get the status of MFA enrollment, call **getEnrollmentStatus()**.
 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/branches/master/b06447d02d8e0-get-status-of-physical-verification-setup-configuration for more details.
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
export function getEnrollmentStatus(status_id: string, accessToken: string, headers?: HTTPRequestHeader) {
  const _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/notification/status/" + status_id;
  return Helper.createHttpPromise(undefined, _serviceURL, undefined, "POST", accessToken, headers);
}

/**
 * to finish enrollment process of new multi factor authentication, call **enrollVerification()**.
 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/branches/master/20ec76e937b27-enroll-physical-verification-setup for more details.
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
export function enrollVerification(options: EnrollVerificationRequest) {
  const _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/enroll/" + options.verification_type;
  return Helper.createHttpPromise(options, _serviceURL, undefined, "POST");
}

/**
 * to see details of configured verification type, call **checkVerificationTypeConfigured()**.
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
export function checkVerificationTypeConfigured(options: CheckVerificationTypeConfiguredRequest) {
  const _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/public/configured/check/" + options.verification_type;
  return Helper.createHttpPromise(options, _serviceURL, undefined, "POST");
}

/**
 * to initiate multi factor auhentication, call **initiateMFA()**. 
 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/2a3ea581bb249-initiate-verification for more details.
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
export function initiateMFA(options: InitiateMFARequest, accessToken?: string, headers?: HTTPRequestHeader) {
  const _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/initiate/" + options.type;
  // BREAKING TODO: remove accessToken parameter in the next major release
  if (accessToken) {
    return Helper.createHttpPromise(options, _serviceURL, false, "POST", accessToken, headers);
  } 
  return Helper.createHttpPromise(options, _serviceURL, false, "POST", undefined, headers);
}

/**
 * to authenticate with multi factor auhentication, call **authenticateMFA()**. 
 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/1aa38936252d6-perform-the-authentication-method for more details.
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
export function authenticateMFA(options: AuthenticateMFARequest, headers?: HTTPRequestHeader) {
  const _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/authenticate/" + options.type;
  return Helper.createHttpPromise(options, _serviceURL, undefined, "POST", undefined, headers);
}

/**
 * to initiate verification process, call **initiateVerification**
 */
export function initiateVerification(options: InitiateVerificationRequest, trackId: string, method: string) {
  const serviceURL = window.webAuthSettings.authority + '/verification-actions-srv/setup/' + method + '/initiate/' + trackId;
  return Helper.createHttpPromise(options, serviceURL, undefined, 'POST');
}

/**
 * to finish configuring verification process, call **configureVerification**
 */
export function configureVerification(options: ConfigureVerificationRequest, method: string) {
  const serviceURL = window.webAuthSettings.authority + '/verification-actions-srv/setup/' + method + '/verification' ;
  return Helper.createHttpPromise(options, serviceURL, undefined, 'POST');
}

/**
 * to configure friendly name, call **configureFriendlyName**
 */
export function configureFriendlyName(options: ConfigureFriendlyNameRequest, trackId: string, method: string) {
  const serviceURL = window.webAuthSettings.authority + '/verification-actions-srv/setup/users/friendlyname/' + method.toUpperCase() + '/' + trackId ;
  return Helper.createHttpPromise(options, serviceURL, undefined, 'PUT');
}
