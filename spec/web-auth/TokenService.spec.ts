import { AccessTokenRequest, TokenIntrospectionEntity } from '../../src/main/web-auth/Entities';
import { Helper } from '../../src/main/web-auth/Helper';
import * as TokenService from '../../src/main/web-auth/TokenService';

const authority = 'baseURL';
const serviceBaseUrl: string = `${authority}/token-srv`;
const httpSpy = jest.spyOn(Helper, 'createHttpPromise');
const createFormSpy = jest.spyOn(Helper, 'createForm');
const submitFormSpy = jest.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation();

beforeAll(() => {
	window.webAuthSettings = { authority: authority, client_id: '', redirect_uri: '' };
});

test('renewToken', () => {
	const options: AccessTokenRequest = {
		user_agent: 'user_agent',
		ip_address: 'ip_address',
		accept_language: 'accept_language',
		lat: 'lat',
		lng: 'lng',
		finger_print: 'finger_print',
		referrer: 'referrer',
		pre_login_id: 'pre_login_id',
		login_type: 'login_type',
		device_code: 'device_code',
		refresh_token: 'refresh_token'
	};
	const serviceURL = `${serviceBaseUrl}/token`;
	void TokenService.renewToken(options);
	expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, 'POST');
});

test('getAccessToken', () => {
	window.webAuthSettings.disablePKCE = true;
	const options: AccessTokenRequest = {
		user_agent: 'user_agent',
		ip_address: 'ip_address',
		accept_language: 'accept_language',
		lat: 'lat',
		lng: 'lng',
		finger_print: 'finger_print',
		referrer: 'referrer',
		pre_login_id: 'pre_login_id',
		login_type: 'login_type',
		device_code: 'device_code',
		refresh_token: 'refresh_token',
		code: 'code',
		client_id: 'client_id',
		redirect_uri: 'redirect_uri',
		grant_type: 'authorization_code',
		code_verifier: 'code_verifier'
	}
	const serviceURL = `${serviceBaseUrl}/token`;
	void TokenService.getAccessToken(options);
	expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, 'POST');
});

test('validateAccessToken', () => {
	const options: TokenIntrospectionEntity = {
		token: 'token',
		token_type_hint: 'token_type_hint',
		strictGroupValidation: false,
		strictScopeValidation: false,
		strictRoleValidation: false,
		strictValidation: false
	};
	const serviceURL = `${serviceBaseUrl}/introspect`;
	void TokenService.validateAccessToken(options);
	expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST', 'token');
});

test('loginPrecheck', () => {
	const options = {
		track_id: 'track_id',
		locale: 'locale'
	};
	const serviceURL = `${serviceBaseUrl}/prelogin/metadata/${options.track_id}?acceptLanguage=${options.locale}`;
	void TokenService.loginPrecheck(options);
	expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET');
});

test('getMissingFields', () => {
	const trackId = 'trackId';
	const serviceURL = `${serviceBaseUrl}/prelogin/metadata/${trackId}`;
	void TokenService.getMissingFields(trackId);
	expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET');
});

test('initiateDeviceCode', () => {
	const clientId = 'clientId';
	const serviceURL = `${authority}/authz-srv/device/authz?client_id=${clientId}`;
	void TokenService.initiateDeviceCode(clientId);
	expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET');
});

test('deviceCodeVerify', () => {
	const code = 'code';
	const encodedCode = encodeURI(code);
	const options = {
		user_code: encodedCode
	}
	const serviceURL = `${serviceBaseUrl}/device/verify?user_code=${encodedCode}`;
	TokenService.deviceCodeVerify(code);
	expect(createFormSpy).toHaveBeenCalledWith(serviceURL, options, 'GET');
	expect(submitFormSpy).toHaveBeenCalled();
});

test('offlineTokenCheck', () => {
	window.webAuthSettings.scope = 'profile email openid cidaas:register javascript_sdk_example_scope_consent offline_access cidaas:users_write';
	window.webAuthSettings.authority = 'https://demo.cidaas.de';
	const accessToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjZlMmFkYzQ3LWE0OTMtNDM0Yi1hZTJiLTM4YzlkZjA0YzQ0OCJ9.eyJhbXIiOlsiMTAiXSwidWFfaGFzaCI6ImVlZGU4NWRiNGI0M2UwOTU4NThjYzYxM2Q5YzQ4ZTExIiwic2lkIjoiODFmYTBiZjMtNjliZC00MzY4LThiOWYtYWQ2NjE0ODczZGM2Iiwic3ViIjoiOGQyNGIwMDQtOTM0NS00Y2M5LTg4NWUtY2YyZDhiN2Q5ZmI1IiwiaXN1YiI6IjI1ZmMxZWY2LTdjMDItNDA4NS1iMjQyLWJlMTAzYmIxMjdhYSIsImF1ZCI6ImQ1NjExMjY3LTNhODgtNDI3Mi1iYjI0LWU5MDJkZGVkYjdiNCIsImlhdCI6MTcwMDU2NzAyMiwiYXV0aF90aW1lIjoxNzAwNTY3MDIxLCJpc3MiOiJodHRwczovL2RlbW8uY2lkYWFzLmRlIiwianRpIjoiMzIxMjhlNjQtNzczNi00ZmEwLTljMGUtMDVhNTg3NGQ2NzBjIiwibm9uY2UiOiIxNzAwNTY3MDEwOTU5Iiwic2NvcGVzIjpbInByb2ZpbGUiLCJlbWFpbCIsIm9wZW5pZCIsImNpZGFhczpyZWdpc3RlciIsImphdmFzY3JpcHRfc2RrX2V4YW1wbGVfc2NvcGVfY29uc2VudCIsIm9mZmxpbmVfYWNjZXNzIiwiY2lkYWFzOnVzZXJzX3dyaXRlIl0sInJvbGVzIjpbIlVTRVIiXSwiZXhwIjoxNzAwNjUzNDIyfQ.B6LWNNMuwgrbWjlKa6eHvNYwaA4eDLGpXIda1LAKREf5RAysZ3e4eAGnRoTIaNCCCSm46Cm_H4UmJv3IlBuBMD7sm88BPZHDiILTRGjK4xfZnbzf9R4IzajEpPGjwODip813AjoKlS0L7SMVz_7-xdH-sUSB8ecFNg8ImvMt14hf84rvIWgKe4CBeu9AuKs4d_-ChWdQ4PWxAl4s6ssG0F7uotLzgWOzZaFPTI9bQFlPSuQ5MpZurM5J60b9fiUhom7sJE2yVfyWeVn9vXX77LeSFuochA6whikb1l6tz5-s0VP-L1tZwGv4abpjM_PfeIi-xYoYjU6xsHawrmLxkA';
	const result = {
		isExpiryDateValid: false,
		isScopesValid: true,
		isIssuerValid: true
	}
	expect(TokenService.offlineTokenCheck(accessToken)).toEqual(result);
});