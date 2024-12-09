import { Helper } from "../common/Helper";
import { InvokeIdValidationCaseRequest } from "./IdValidationService.model";

/**
  * To invoke a new id validation case, call invokeIdValidationCase(). 
  * Make sure that the access token, which is used to call this api (either as parameter or from user storage) have the following scope: cidaas:idval_init
  *
  * @param options 
  * @param access_token
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
        return Helper.createHttpPromise(options, serviceURL, false, 'POST', access_token);
    }
    return Helper.getAccessTokenFromUserStorage().then((accessToken) => {
        return Helper.createHttpPromise(options, serviceURL, false, 'POST', accessToken);
    });
}
