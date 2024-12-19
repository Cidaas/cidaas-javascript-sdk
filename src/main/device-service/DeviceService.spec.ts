import { DeviceService } from './DeviceService';
import { OidcSettings } from "../authentication/Authentication.model";
import ConfigUserProvider from "../common/ConfigUserProvider";
import { Helper } from "../common/Helper";
import { DeleteDeviceRequest } from './DeviceService.model';

const authority = 'baseURL';
const serviceBaseUrl: string = `${authority}/device-srv`;
const httpSpy = jest.spyOn(Helper, 'createHttpPromise');
let deviceService: DeviceService;

beforeAll(() => {
	const options: OidcSettings = {
    authority: authority,
    client_id: '',
    redirect_uri: ''
  };
  const configUserProvider: ConfigUserProvider = new ConfigUserProvider(options);
  deviceService = new DeviceService(configUserProvider);
});

test('getDevicesInfo', () => {
    const acccessToken = 'accessToken';
    const serviceURL = `${serviceBaseUrl}/devices`;
    deviceService.getDevicesInfo(acccessToken);
    expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET', acccessToken);
});

test('deleteDevice', () => {
    const options: DeleteDeviceRequest = {
        device_id: 'device_id',
        userAgent: window.navigator.userAgent
    };
    const acccessToken = 'accessToken';
    const serviceURL = `${serviceBaseUrl}/device/${options.device_id}`;
    deviceService.deleteDevice(options, acccessToken);
    expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'DELETE', acccessToken);
});

test('createDeviceInfo', () => {
    const options = {
        userAgent: window.navigator.userAgent
    };
    const serviceURL = `${serviceBaseUrl}/deviceinfo`;
    deviceService.createDeviceInfo();
    expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST');
});