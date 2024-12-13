import { PublicService } from "./PublicService";
import { OidcSettings } from "../authentication-service/AuthenticationService.model";
import ConfigUserProvider from "../common/ConfigUserProvider";
import { Helper } from "../common/Helper";
import { GetRequestIdRequest } from "./PublicService.model";

const authority = 'baseURL';
const defaultResponseMode = 'fragment';
const mockDate = new Date('1970-01-01T00:00:00Z');
const httpSpy = jest.spyOn(Helper, 'createHttpPromise');
const options: OidcSettings = {
    authority: 'baseURL',
    client_id: 'clientId',
    redirect_uri: 'redirectUri',
    post_logout_redirect_uri: 'logoutUri',
    response_type: 'code',
    scope: 'scope'
};
let configUserProvider;
let publicService: PublicService;

beforeAll(() => {
  configUserProvider = new ConfigUserProvider(options);
  publicService = new PublicService(configUserProvider);
});

test('doNotRemoveAuthorityTrailingSlashIfNotExist', () => {
    const optionsWithoutTrailingSlashAuthority: OidcSettings = { ...options, authority: 'https://domain/path' };
    const configUserProviderWithoutTrailingSlashAuthority: ConfigUserProvider = new ConfigUserProvider(optionsWithoutTrailingSlashAuthority);
    expect(configUserProviderWithoutTrailingSlashAuthority.getConfig().authority).toEqual('https://domain/path');
});

test('removeAuthorityTrailingSlashIfExist', () => {
    const optionsWithTrailingSlashAuthority: OidcSettings = { ...options, authority: 'https://domain/path/' };
    const configUserProviderWithTrailingSlashAuthority: ConfigUserProvider = new ConfigUserProvider(optionsWithTrailingSlashAuthority);
    expect(configUserProviderWithTrailingSlashAuthority.getConfig().authority).toEqual('https://domain/path');
});

test('getRequestIdWithParameter', () => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const option: GetRequestIdRequest  = {
        'client_id': 'custom client_id',
        'redirect_uri': 'custom redirect_uri',
    };
    const payload: GetRequestIdRequest = {
        'client_id': option.client_id,
        'redirect_uri': option.redirect_uri,
        'response_type': configUserProvider.getConfig().response_type,
        "response_mode": defaultResponseMode,
        "scope": configUserProvider.getConfig().scope,
        "nonce": mockDate.getTime().toString()
    }
    const serviceURL = `${authority}/authz-srv/authrequest/authz/generate`;
    publicService.getRequestId(option);
    jest.useRealTimers();
    expect(httpSpy).toHaveBeenCalledWith(payload, serviceURL, false, 'POST');
});

test('getRequestIdWithoutParameter', () => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const defaultPayload: GetRequestIdRequest  = {
        'client_id': configUserProvider.getConfig().client_id,
        'redirect_uri': configUserProvider.getConfig().redirect_uri,
        'response_type': configUserProvider.getConfig().response_type,
        "response_mode": defaultResponseMode,
        "scope": configUserProvider.getConfig().scope,
        "nonce": mockDate.getTime().toString()
    };
    const serviceURL = `${authority}/authz-srv/authrequest/authz/generate`;
    publicService.getRequestId();
    jest.useRealTimers();
    expect(httpSpy).toHaveBeenCalledWith(defaultPayload, serviceURL, false, 'POST');
});

test('getTenantInfo', () => {
    const serviceURL = `${authority}/public-srv/tenantinfo/basic`;
    publicService.getTenantInfo();
    expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET');
});

test('getClientInfo', () => {
    const options = {
        requestId: 'requestId'
    };
    const serviceURL = `${authority}/public-srv/public/${options.requestId}`;
    publicService.getClientInfo(options);
    expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET');
});