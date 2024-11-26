import * as VerificationService  from './VerificationService';
import { Helper } from "../common/Helper";
import { AuthenticateMFARequest,  CancelMFARequest, CheckVerificationTypeConfiguredRequest, ConfigureFriendlyNameRequest, ConfigureVerificationRequest, EnrollVerificationRequest, GetMFAListRequest, InitiateAccountVerificationRequest, InitiateEnrollmentRequest, InitiateMFARequest, InitiateVerificationRequest, VerifyAccountRequest } from './VerificationService.model';

const authority = 'baseURL';
const serviceBaseUrl: string = `${authority}/verification-srv`;
const actionsServiceBaseUrl: string = `${authority}/verification-actions-srv`;
const createFormSpy = jest.spyOn(Helper, 'createForm');
const submitFormSpy = jest.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation();
const httpSpy = jest.spyOn(Helper, 'createHttpPromise');

beforeAll(() => {
  window.webAuthSettings = { authority: authority, client_id: '', redirect_uri: '' };
});

test('initiateAccountVerification', () => {
  const options: InitiateAccountVerificationRequest = {
    sub: '123'
  };
  const serviceURL = `${serviceBaseUrl}/account/initiate`;
  VerificationService.initiateAccountVerification(options);
  expect(createFormSpy).toHaveBeenCalledWith(serviceURL, options);
  expect(submitFormSpy).toHaveBeenCalled();
});

test('verifyAccount', () => {
  const options: VerifyAccountRequest = {
    accvid: 'accvid',
    code: 'code'
  };
  const serviceURL = `${serviceBaseUrl}/account/verify`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  VerificationService.verifyAccount(options, headers);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST", undefined, headers);
});

test('getMFAList', () => {
  const options: GetMFAListRequest = {
    email: 'email',
    request_id: 'request_id'
  };
  const serviceURL = `${serviceBaseUrl}/v2/setup/public/configured/list`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  VerificationService.getMFAList(options, headers);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST", undefined, headers);
});

test('cancelMFA', () => {
  const options: CancelMFARequest = {
    exchange_id: 'exchange_id',
    reason: 'reason',
    type: 'type'
  };
  const serviceURL = `${serviceBaseUrl}/v2/authenticate/cancel/${options.type}`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  VerificationService.cancelMFA(options, headers);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST", undefined, headers);
});

test('getAllVerificationList', () => {
  const accessToken = 'accessToken';
  const serviceURL = `${serviceBaseUrl}/config/list`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  VerificationService.getAllVerificationList(accessToken, headers);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, undefined, "GET", accessToken, headers);
});

test('initiateEnrollment', () => {
  const options: InitiateEnrollmentRequest = {
    verification_type: 'verification_type',
    deviceInfo: {
      deviceId: 'deviceId', 
      location: {
        lat: 'lat', 
        lon: 'lon'
      }
    }
  };
  const accessToken = 'accessToken';
  const serviceURL = `${serviceBaseUrl}/v2/setup/initiate/${options.verification_type}`;
  VerificationService.initiateEnrollment(options, accessToken);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST", accessToken);
});

test('getEnrollmentStatus', () => {
  const status_id = 'status_id';
  const accessToken = 'accessToken';
  const serviceURL = `${serviceBaseUrl}/v2/notification/status/${status_id}`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  VerificationService.getEnrollmentStatus(status_id, accessToken, headers);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, undefined, "POST", accessToken, headers);
});

test('enrollVerification', () => {
  const options: EnrollVerificationRequest = {
    exchange_id: 'exchange_id',
    device_id: 'device_id',
    client_id: 'client_id',
    pass_code: 'pass_code',
    fido2_client_response: {},
    verification_type: 'verification_type'
  };
  const serviceURL = `${serviceBaseUrl}/v2/setup/enroll/${options.verification_type}`;
  VerificationService.enrollVerification(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST");
});

test('checkVerificationTypeConfigured', () => {
  const options: CheckVerificationTypeConfiguredRequest = {
    email: 'email',
    request_id: 'request_id',
    verification_type: 'verification_type'
  };
  const serviceURL = `${serviceBaseUrl}/v2/setup/public/configured/check/${options.verification_type}`;
  VerificationService.checkVerificationTypeConfigured(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST");
});

test('initiateMFA', () => {
  const options: InitiateMFARequest = {
    usage_type: 'usage_type',
    request_id: 'request_id',
    type: 'type'
  };
  const serviceURL = `${serviceBaseUrl}/v2/authenticate/initiate/${options.type}`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  VerificationService.initiateMFA(options, undefined, headers);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST", undefined, headers);
});

test('initiateMFA with access token', () => {
  const options: InitiateMFARequest = {
    usage_type: 'usage_type',
    request_id: 'request_id',
    type: 'type'
  };
  const accessToken = 'accessToken';
  const serviceURL = `${serviceBaseUrl}/v2/authenticate/initiate/${options.type}`;
  VerificationService.initiateMFA(options, accessToken);
  // access token is not needed for initiateMFA and will be removed in the next major release
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST", undefined, undefined);
});

test('authenticateMFA', () => {
  const options: AuthenticateMFARequest = {
    type: 'type',
    exchange_id: 'exchange_id',
    pass_code: 'pass_code',
  };
  const serviceURL = `${serviceBaseUrl}/v2/authenticate/authenticate/${options.type}`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  VerificationService.authenticateMFA(options, headers);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST", undefined, headers);
});

test('initiateVerification', () => {
  const options: InitiateVerificationRequest = {
    email: 'email'
  };
  const trackId = 'trackId';
  const method = 'method';
  const serviceURL = `${actionsServiceBaseUrl}/setup/${method}/initiate/${trackId}`;
  VerificationService.initiateVerification(options, trackId, method);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, 'POST');
});

test('configureVerification', () => {
  const options: ConfigureVerificationRequest = {
    exchange_id: 'exchangeId',
    sub: 'sub',
    pass_code: 'passCode'
  };
  const method = 'method';
  const serviceURL = `${actionsServiceBaseUrl}/setup/${method}/verification`;
  VerificationService.configureVerification(options, method);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, 'POST');
});

test('configureFriendlyName', () => {
  const options: ConfigureFriendlyNameRequest = {
    sub: 'sub',
    friendly_name: 'friendly name'
  };
  const trackId = 'trackId';
  const method = 'method';
  const serviceURL = `${actionsServiceBaseUrl}/setup/users/friendlyname/${method.toUpperCase()}/${trackId}`;
  VerificationService.configureFriendlyName(options, trackId, method);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, 'PUT');
});