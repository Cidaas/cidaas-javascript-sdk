import { OidcManager, OidcSettings } from "../authentication-service/AuthenticationService.model";
import ConfigUserProvider from "../common/ConfigUserProvider";
import { Helper } from "../common/Helper";
import { DeleteDeviceRequest } from "./DeviceService.model";

export class DeviceService {
    private config: OidcSettings;
    private userManager: OidcManager;

    constructor(configUserProvider: ConfigUserProvider) {
        this.config = configUserProvider.getConfig();
        this.userManager = configUserProvider.getUserManager();
    }

    /**
     * To get all devices information associated to the client, call **getDevicesInfo()**
     * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/2a2feed70303c-get-device-by-user for more details.
     * @example
     * ```js
     * cidaas.getDevicesInfo().then(function (resp) {
     *   // the response will give you devices informations.
     * }).catch(function(ex) {
     *   // your failure code here
     * });
     * ```
     */
    getDevicesInfo(options?: void, access_token?: string) {
        // BREAKING TODO: remove options parameter in the next major release
        const _serviceURL = this.config.authority + "/device-srv/devices";
        if (access_token) {
            return Helper.createHttpPromise(undefined, _serviceURL, false, "GET", access_token);
        }
        return Helper.getAccessTokenFromUserStorage(this.userManager).then((accessToken) => {
            return Helper.createHttpPromise(undefined, _serviceURL, false, "GET", accessToken);
        });
    }

    /**
     * To delete device associated to the client, call **deleteDevice()**
     * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/3d44ad903d6e8-logout-the-user-for-a-device for more details.
     * @example
     * ```js
     * const options = {
     *   device_id: 'id of device associated to the client.' // call **getDevicesInfo()** to get List of device ids and its details.
     * };
     * cidaas.deleteDevice(options).then(function (resp) {
     *   // your success code
     * }).catch(function(ex) {
     *   // your failure code
     * });
     * ```
     */
    deleteDevice(options: DeleteDeviceRequest, access_token?: string) {
        const _serviceURL = this.config.authority + "/device-srv/device/" + options.device_id;
        const payload: DeleteDeviceRequest = window.navigator.userAgent ? { ...options, userAgent: window.navigator.userAgent } : undefined;
        if (access_token) {
            return Helper.createHttpPromise(payload, _serviceURL, false, "DELETE", access_token);
        }
        return Helper.getAccessTokenFromUserStorage(this.userManager).then((accessToken) => {
            return Helper.createHttpPromise(payload, _serviceURL, false, "DELETE", accessToken);
        });
    }


    /**
     * to generate device info, call **createDeviceInfo()**.
     * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/9b5a892afaf0b-create-device-info for more details.
     * @example
     * ```js
     * cidaas.createDeviceInfo().then(function (resp) {
     *   // your success code
     * }).catch(function(ex) {
     *   // your failure code
     * });
     * ```
     */
    createDeviceInfo() {
        const value = ('; ' + document.cookie).split(`; cidaas_dr=`).pop().split(';')[0];
        if (!value) {
            const options = {
                userAgent: window.navigator.userAgent
            };
            const serviceURL = this.config.authority + '/device-srv/deviceinfo';
            return Helper.createHttpPromise(options, serviceURL, false, 'POST');
        }
    }
}
