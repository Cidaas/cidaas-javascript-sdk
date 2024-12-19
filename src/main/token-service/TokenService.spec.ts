import { GenerateTokenFromCodeRequest } from './TokenService.model';
import { Helper } from '../common/Helper';
import { TokenService } from './TokenService';
import ConfigUserProvider from '../common/ConfigUserProvider';
import { OidcSettings } from '../authentication/Authentication.model';

const authority = 'baseURL';
const serviceBaseUrl: string = `${authority}/token-srv`;
const httpSpy = jest.spyOn(Helper, 'createHttpPromise');
const createFormSpy = jest.spyOn(Helper, 'createForm');
const submitFormSpy = jest.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation();
let config: OidcSettings = {
	authority: authority,
	client_id: '',
	redirect_uri: '',
	disablePKCE: true
};
let tokenService: TokenService;
let configUserProvider: ConfigUserProvider

beforeAll(() => {
	configUserProvider = new ConfigUserProvider(config);
	tokenService = new TokenService(configUserProvider);
});

test('generateTokenFromCode', () => {
	configUserProvider.setConfig({...config, disablePKCE: true});
	tokenService = new TokenService(configUserProvider);
	const options: GenerateTokenFromCodeRequest = {
		code: 'code',
		code_verifier: 'code_verifier',
		client_id: 'client_id',
		grant_type: 'authorization_code',
		redirect_uri: 'redirect_uri'
	}
	const serviceURL = `${serviceBaseUrl}/token`;
	tokenService.generateTokenFromCode(options);
	expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, 'POST');
});

test('loginPrecheck', () => {
	const options = {
		track_id: 'track_id',
	};
	const serviceURL = `${serviceBaseUrl}/prelogin/metadata/${options.track_id}`;
	const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
	tokenService.loginPrecheck(options, headers);
	expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET', undefined, headers);
});

test('getMissingFields', () => {
	const trackId = 'trackId';
	const serviceURL = `${serviceBaseUrl}/prelogin/metadata/${trackId}`;
	const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
	tokenService.getMissingFields(trackId, headers);
	expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET', undefined, headers);
});

test('initiateDeviceCode', () => {
	const clientId = 'clientId';
	const serviceURL = `${authority}/authz-srv/device/authz?client_id=${clientId}`;
	tokenService.initiateDeviceCode(clientId);
	expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET');
});

test('deviceCodeVerify', () => {
	const code = 'code';
	const encodedCode = encodeURI(code);
	const options = {
		user_code: encodedCode
	}
	const serviceURL = `${serviceBaseUrl}/device/verify?user_code=${encodedCode}`;
	tokenService.deviceCodeVerify(code);
	expect(createFormSpy).toHaveBeenCalledWith(serviceURL, options, 'GET');
	expect(submitFormSpy).toHaveBeenCalled();
});

test('offlineTokenCheck', () => {
	const scope = 'profile email openid cidaas:register javascript_sdk_example_scope_consent offline_access cidaas:users_write';
	const authority = 'https://demo.cidaas.de';
	configUserProvider.setConfig({...config, scope: scope, authority: authority});
	tokenService = new TokenService(configUserProvider);
	const accessToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjZlMmFkYzQ3LWE0OTMtNDM0Yi1hZTJiLTM4YzlkZjA0YzQ0OCJ9.eyJhbXIiOlsiMTAiXSwidWFfaGFzaCI6ImVlZGU4NWRiNGI0M2UwOTU4NThjYzYxM2Q5YzQ4ZTExIiwic2lkIjoiODFmYTBiZjMtNjliZC00MzY4LThiOWYtYWQ2NjE0ODczZGM2Iiwic3ViIjoiOGQyNGIwMDQtOTM0NS00Y2M5LTg4NWUtY2YyZDhiN2Q5ZmI1IiwiaXN1YiI6IjI1ZmMxZWY2LTdjMDItNDA4NS1iMjQyLWJlMTAzYmIxMjdhYSIsImF1ZCI6ImQ1NjExMjY3LTNhODgtNDI3Mi1iYjI0LWU5MDJkZGVkYjdiNCIsImlhdCI6MTcwMDU2NzAyMiwiYXV0aF90aW1lIjoxNzAwNTY3MDIxLCJpc3MiOiJodHRwczovL2RlbW8uY2lkYWFzLmRlIiwianRpIjoiMzIxMjhlNjQtNzczNi00ZmEwLTljMGUtMDVhNTg3NGQ2NzBjIiwibm9uY2UiOiIxNzAwNTY3MDEwOTU5Iiwic2NvcGVzIjpbInByb2ZpbGUiLCJlbWFpbCIsIm9wZW5pZCIsImNpZGFhczpyZWdpc3RlciIsImphdmFzY3JpcHRfc2RrX2V4YW1wbGVfc2NvcGVfY29uc2VudCIsIm9mZmxpbmVfYWNjZXNzIiwiY2lkYWFzOnVzZXJzX3dyaXRlIl0sInJvbGVzIjpbIlVTRVIiXSwiZXhwIjoxNzAwNjUzNDIyfQ.B6LWNNMuwgrbWjlKa6eHvNYwaA4eDLGpXIda1LAKREf5RAysZ3e4eAGnRoTIaNCCCSm46Cm_H4UmJv3IlBuBMD7sm88BPZHDiILTRGjK4xfZnbzf9R4IzajEpPGjwODip813AjoKlS0L7SMVz_7-xdH-sUSB8ecFNg8ImvMt14hf84rvIWgKe4CBeu9AuKs4d_-ChWdQ4PWxAl4s6ssG0F7uotLzgWOzZaFPTI9bQFlPSuQ5MpZurM5J60b9fiUhom7sJE2yVfyWeVn9vXX77LeSFuochA6whikb1l6tz5-s0VP-L1tZwGv4abpjM_PfeIi-xYoYjU6xsHawrmLxkA';
	const result = {
		isExpiryDateValid: false,
		isScopesValid: true,
		isIssuerValid: true
	}
	expect(tokenService.offlineTokenCheck(accessToken)).toEqual(result);
});