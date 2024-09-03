import * as VerificationService  from './VerificationService';
import { Helper } from "../common/Helper";
import { AuthenticateMFARequest,  CancelMFARequest, CheckVerificationTypeConfiguredRequest, EnrollVerificationRequest, GetMFAListRequest, InitiateAccountVerificationRequest, InitiateEnrollmentRequest, InitiateMFARequest, VerifyAccountRequest } from './VerificationService.model';


const authority = 'baseURL';
const serviceBaseUrl: string = `${authority}/verification-srv`;
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
  void VerificationService.verifyAccount(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST");
});

test('getMFAList', () => {
  const options: GetMFAListRequest = {
    email: 'email',
    request_id: 'request_id'
  };
  const serviceURL = `${serviceBaseUrl}/v2/setup/public/configured/list`;
  void VerificationService.getMFAList(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST");
});

test('cancelMFA', () => {
  const options: CancelMFARequest = {
    exchange_id: 'exchange_id',
    reason: 'reason',
    type: 'type'
  };
  const serviceURL = `${serviceBaseUrl}/v2/authenticate/cancel/${options.type}`;
  void VerificationService.cancelMFA(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST");
});

test('getAllVerificationList', () => {
  const accessToken = 'accessToken';
  const serviceURL = `${serviceBaseUrl}/config/list`;
  void VerificationService.getAllVerificationList(accessToken);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, undefined, "GET", accessToken);
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
  void VerificationService.initiateEnrollment(options, accessToken);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST", accessToken);
});

test('getEnrollmentStatus', () => {
  const status_id = 'status_id';
  const accessToken = 'accessToken';
  const serviceURL = `${serviceBaseUrl}/v2/notification/status/${status_id}`;
  void VerificationService.getEnrollmentStatus(status_id, accessToken);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, undefined, "POST", accessToken);
});

test('enrollVerification', () => {
  const options: EnrollVerificationRequest = {
    exchange_id: 'exchange_id',
    device_id: 'device_id',
    finger_print: 'finger_print',
    client_id: 'client_id',
    push_id: 'push_id',
    pass_code: 'pass_code',
    pkce_key: 'pkce_key',
    face_attempt: 0,
    attempt: 0,
    fido2_client_response: {},
    verification_type: 'verification_type'
  };
  const serviceURL = `${serviceBaseUrl}/v2/setup/enroll/${options.verification_type}`;
  void VerificationService.enrollVerification(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST");
});

test('checkVerificationTypeConfigured', () => {
  const options: CheckVerificationTypeConfiguredRequest = {
    email: 'email',
    request_id: 'request_id',
    verification_type: 'verification_type'
  };
  const serviceURL = `${serviceBaseUrl}/v2/setup/public/configured/check/${options.verification_type}`;
  void VerificationService.checkVerificationTypeConfigured(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST");
});

test('initiateMFA', () => {
  const options: InitiateMFARequest = {
    usage_type: 'usage_type',
    processingType: 'processingType',
    request_id: 'request_id',
    type: 'type'
  };
  const serviceURL = `${serviceBaseUrl}/v2/authenticate/initiate/${options.type}`;
  void VerificationService.initiateMFA(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST");
});

test('initiateMFA with access token', () => {
  const options: InitiateMFARequest = {
    usage_type: 'usage_type',
    processingType: 'processingType',
    request_id: 'request_id',
    type: 'type'
  };
  const accessToken = 'accessToken';
  const serviceURL = `${serviceBaseUrl}/v2/authenticate/initiate/${options.type}`;
  void VerificationService.initiateMFA(options, accessToken);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST", accessToken);
});

test('authenticateMFA', () => {
  const options: AuthenticateMFARequest = {
    type: 'type',
    exchange_id: 'exchange_id',
    client_id: 'client_id'
  };
  const serviceURL = `${serviceBaseUrl}/v2/authenticate/authenticate/${options.type}`;
  void VerificationService.authenticateMFA(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST");
});