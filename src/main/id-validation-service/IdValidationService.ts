import { Helper } from "../common/Helper";
import { InvokeIdValidationCaseRequest } from "./IdValidationService.model";

/**
  * To invoke a new id validation case, call invokeIdValidationCase(). 
  * Make sure that the access token, which is used to call this api (either as parameter or from user storage) 
  * have the following scopes: cidaas:idval_init cidaas:idval_perform cidaas:idval_settings_read profile
  *
  * @param options payload to be sent to the api
  * @param access_token will either be given as function parameter or will be fetch from user storage if not given
  * 
  * @example
  * ```js
  * import { IdValidationService } from 'cidaas-javascript-sdk';
  * 
  * const options = {
  *   redirect_url: 'your redirect uri',
  *   validation_settings_id: 'validation settings id from admin ui'
  * };
  * 
  * IdValidationService.invokeIdValidationCase(options).then(function (resp) {
  *   // your success code
  * }).catch(function(ex) {
  *   // your failure code
  * });
  * ```
  */
export function invokeIdValidationCase(options: InvokeIdValidationCaseRequest, access_token?: string) {
    const serviceURL = window.webAuthSettings.authority + '/idval-sign-srv/caseinvocation';
    if (access_token) {
        return callIdValidationAPI(options, serviceURL, access_token);
    }
    return Helper.getAccessTokenFromUserStorage().then((accessToken) => {
        return callIdValidationAPI(options, serviceURL, accessToken);
    });
}

/** 
 * API call and response handling of id validation case invocation. This function will be called internally by invokeIdValidationCase() function.
 * 
 * @param options payload to be sent to the api
 * @param serviceURL will be provided by invokeIdValidationCase() function
 * @param access_token comes from either invokeIdValidationCase() function parameter or from user storage
 */
function callIdValidationAPI(options: InvokeIdValidationCaseRequest, serviceURL: string, access_token: string) {
    return Helper.createHttpPromise(options, serviceURL, false, 'POST', access_token).then(response => {
        if (response?.success && response.data) {
            const redirectUrl = response.data.case_redirect_url;
            window.location.href = redirectUrl;
        } else {
            console.info(`${response.error_code}: ${response.error}`);
        }
    });
}