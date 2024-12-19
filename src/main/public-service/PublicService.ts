import { OidcSettings } from "../authentication-service/AuthenticationService.model";
import ConfigUserProvider from "../common/ConfigUserProvider";
import { Helper } from "../common/Helper";
import { GetRequestIdRequest, GetClientInfoRequest } from "./PublicService.model";

export class PublicService {
    private config: OidcSettings;

    constructor(configUserProvider: ConfigUserProvider) {
        this.config = configUserProvider.getConfig();
    }

    /**
     * Each and every proccesses starts with requestId, it is an entry point to login or register. For getting the requestId, call **getRequestId()**.
     * @example
     * ```js
     * // To get requestId using default configured settings, run the function without parameter
     * cidaas.getRequestId().then(function (response) {
     *   // the response will give you request id.
     * }).catch(function(ex) {
     *   // your failure code here
     * });
     * 
     * // To get requestId using custom settings, run the function with custom setting(s) inside option parameter. Example below will only override client_id & redirect_uri
     * const option: GetRequestIdRequest = {
     *   'client_id': 'your client id',
     *   'redirect_uri': 'your redirect url',  
     * }
     * cidaas.getRequestId(option).then(function (response) {
     *   // the response will give you request id.
     * }).catch(function(ex) {
     *   // your failure code here
     * });
     * ``` 
     */
    getRequestId(option?: GetRequestIdRequest) {
        const ui_locales = this.config.ui_locales
        const payload: GetRequestIdRequest = {
            'client_id': option?.client_id ?? this.config.client_id,
            'redirect_uri': option?.redirect_uri ?? this.config.redirect_uri,
            'response_type': option?.response_type ?? (this.config.response_type || 'token'),
            'response_mode': option?.response_mode ?? (this.config.response_mode || 'fragment'),
            'scope': option?.scope ?? this.config.scope,
            'nonce': new Date().getTime().toString(),
            ...(ui_locales && { ui_locales } || {})
        }
        const serviceURL = this.config.authority + '/authz-srv/authrequest/authz/generate';
        return Helper.createHttpPromise(payload, serviceURL, false, "POST");
    }

    /**
     * To get the tenant basic information, call **getTenantInfo()**. This will return the basic tenant details such as tenant name and allowed login with types (Email, Mobile, Username).
     * @example
     * ```js
     * cidaas.getTenantInfo().then(function (response) {
     *   // the response will give you tenant details
     * }).catch(function(ex) {
     *   // your failure code here
     * });
     * ``` 
     */
    getTenantInfo() {
        const _serviceURL = this.config.authority + "/public-srv/tenantinfo/basic";
        return Helper.createHttpPromise(undefined, _serviceURL, false, "GET");
    }

    /**
     * To get the client basic information, call **getClientInfo()**. This will return the basic client details such as client name and its details.
     * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/dc8a6cfb28abb-public-page-information for more details.
     * @example
     * ```js
     * cidaas.getClientInfo({
     *   requestId: 'your requestId',
     * }).then(function (resp) {
     *   // the response will give you client info.
     * }).catch(function(ex) {
     *   // your failure code here
     * });
     * ```
     */
    getClientInfo(options: GetClientInfoRequest) {
        const _serviceURL = this.config.authority + "/public-srv/public/" + options.requestId;
        return Helper.createHttpPromise(undefined, _serviceURL, false, "GET");
    }

}