import {
  IConfiguredListRequestEntity,
  IInitVerificationAuthenticationRequestEntity,
  FidoSetupEntity,
  IEnrollVerificationSetupRequestEntity,
  IAuthVerificationAuthenticationRequestEntity,
  FaceVerificationAuthenticationRequestEntity,
  AccountVerificationRequestEntity,
} from "./Entities"
import { Helper, CustomException } from "./Helper";

export namespace VerificationService {
  /**
     * initiate verification
     * @param options 
     * @returns 
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
   * initiate verification and return response
   * @param options 
   * @returns 
   */
  export function initiateAccountVerificationAsynFn(options: AccountVerificationRequestEntity) {
    try {
      var searchParams = new URLSearchParams(options);
      var response = fetch(window.webAuthSettings.authority + "/verification-srv/account/initiate", {
        method: "POST",
        redirect: "follow",
        body: searchParams.toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      });

      return response;
    } catch (ex) {
      throw new CustomException(ex, 417);
    }

  };

  /**
   * verify account
   * @param options 
   * @returns 
   */
  export function verifyAccount(options: {
    accvid: string;
    code: string;
  }) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/account/verify";
    return Helper.createPostPromise(options, _serviceURL, false,"POST");
  };

  /**
   * get mfa list v2
   * @param options 
   * @returns 
   */
  export function getMFAListV2(options: IConfiguredListRequestEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/public/configured/list";
    return Helper.createPostPromise(options, _serviceURL, false,"POST");
  };

  /**
   * cancel mfa v2
   * @param options 
   * @returns 
   */
  export function cancelMFAV2(options: {
    exchange_id: string;
    reason: string;
    type: string;
  }) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/cancel/" + options.type;
    return Helper.createPostPromise(options, _serviceURL, undefined,"POST");
  };

  /**
   * @param access_token 
   * @returns 
   */
  export function getAllVerificationList(access_token: string) {
    const _serviceURL = `${window.webAuthSettings.authority}/verification-srv/config/list`;
    return Helper.createPostPromise(undefined, _serviceURL,undefined, "GET", access_token);
  };

  /**
   * enrollVerification
   * @param options 
   * @returns 
   */
  export function enrollVerification(options: IEnrollVerificationSetupRequestEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/enroll/" + options.verification_type;
    return Helper.createPostPromise(options, _serviceURL, undefined,"POST");
  };

  /**
   * @deprecated This function is no longer supported, instead use {this.updateStatus()}
   * @param status_id 
   * @returns 
   */
  export function updateSocket(status_id: string) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/notification/status/" + status_id;
    return Helper.createPostPromise(undefined, _serviceURL, undefined,"POST");
  };

  /**
   * update the status of notification
   * @param status_id 
   * @returns 
   */
  export function updateStatus(status_id: string) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/notification/status/" + status_id;
    return Helper.createPostPromise(undefined, _serviceURL, undefined,"POST");
  };

  /**
   * setupFidoVerification
   * @param options 
   * @returns 
   */
  export function setupFidoVerification(options: FidoSetupEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/initiate/suggestmfa/" + options.verification_type;
    return Helper.createPostPromise(options, _serviceURL, undefined,"POST");
  };

  /**
   * checkVerificationTypeConfigured
   * @param options 
   * @returns 
   */
  export function checkVerificationTypeConfigured(options: IConfiguredListRequestEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/public/configured/check/" + options.verification_type;
    return Helper.createPostPromise(options, _serviceURL, undefined,"POST");
  };

  /**
   * initiate mfa v2
   * @param options 
   * @returns 
   */
  export function initiateMFAV2(options: IInitVerificationAuthenticationRequestEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/initiate/" + options.type;
    return Helper.createPostPromise(options, _serviceURL, false,"POST");
  };

  /**
   * authenticate mfa v2
   * @param options 
   * @returns 
   */
  export function authenticateMFAV2(options: IAuthVerificationAuthenticationRequestEntity) {
    var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/authenticate/" + options.type;
    return Helper.createPostPromise(options, _serviceURL, undefined,"POST");
  };

  /**
   * authenticateVerification form type (for face)
   * @param options 
   * @returns 
   */
  export function authenticateFaceVerification(options: FaceVerificationAuthenticationRequestEntity) {
    return new Promise((resolve, reject) => {
      try {
        var http = new XMLHttpRequest();
        var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/authenticate/face";
        http.onreadystatechange = function () {
          if (http.readyState == 4) {
            if (http.responseText) {
              resolve(JSON.parse(http.responseText));
            } else {
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
      } catch (ex) {
        reject(ex);
      }
    });
  };

}
