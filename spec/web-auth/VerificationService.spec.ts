import * as VerificationService  from '../../src/main/web-auth/VerificationService';
import { Helper } from "../../src/main/web-auth/Helper";
import { AccountVerificationRequestEntity, IAuthVerificationAuthenticationRequestEntity, IConfiguredListRequestEntity, IEnrollVerificationSetupRequestEntity, IInitVerificationAuthenticationRequestEntity } from '../../src/main/web-auth/Entities';


const authority = 'baseURL';
const serviceBaseUrl: string = `${authority}/verification-srv`;
const createFormSpy = jest.spyOn(Helper, 'createForm');
const submitFormSpy = jest.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation();
const httpSpy = jest.spyOn(Helper, 'createHttpPromise');

beforeAll(() => {
  (window as any).webAuthSettings = { authority: authority }
});

test('initiateAccountVerification', () => {
  const options: AccountVerificationRequestEntity = {
    sub: '123'
  };
  const serviceURL = `${serviceBaseUrl}/account/initiate`;
  VerificationService.initiateAccountVerification(options);
  expect(createFormSpy).toHaveBeenCalledWith(serviceURL, options);
  expect(submitFormSpy).toHaveBeenCalled();
});

test('verifyAccount', () => {
  const options = {
    accvid: 'accvid',
    code: 'code'
  };
  const serviceURL = `${serviceBaseUrl}/account/verify`;
  VerificationService.verifyAccount(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST");
});

test('getMFAList', () => {
  const options: IConfiguredListRequestEntity = {
    sub: 'sub',
    email: 'email',
    mobile_number: 'mobile_number',
    username: 'username',
    request_id: 'request_id',
    verification_types: [],
    single_factor_sub_ref: 'single_factor_sub_ref',
    device_fp: 'device_fp',
    provider: 'provider',
    device_id: 'device_id',
    verification_type: 'verification_type'
  };
  const serviceURL = `${serviceBaseUrl}/v2/setup/public/configured/list`;
  VerificationService.getMFAList(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST");
});

test('cancelMFA', () => {
  const options = {
    exchange_id: 'exchange_id',
    reason: 'reason',
    type: 'type'
  };
  const serviceURL = `${serviceBaseUrl}/v2/authenticate/cancel/${options.type}`;
  VerificationService.cancelMFA(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST");
});

test('getAllVerificationList', () => {
  const accessToken = 'accessToken';
  const serviceURL = `${serviceBaseUrl}/config/list`;
  VerificationService.getAllVerificationList(accessToken);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, undefined, "GET", accessToken);
});

test('initiateEnrollment', () => {
  const options = {
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
  VerificationService.getEnrollmentStatus(status_id, accessToken);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, undefined, "POST", accessToken);
});

test('enrollVerification', () => {
  const options: IEnrollVerificationSetupRequestEntity = {
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
  VerificationService.enrollVerification(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST");
});

test('checkVerificationTypeConfigured', () => {
  const options: IConfiguredListRequestEntity = {
    sub: 'sub',
    email: 'email',
    mobile_number: 'mobile_number',
    username: 'username',
    request_id: 'request_id',
    verification_types: [],
    single_factor_sub_ref: 'single_factor_sub_ref',
    device_fp: 'device_fp',
    provider: 'provider',
    device_id: 'device_id',
    verification_type: 'verification_type'
  };
  const serviceURL = `${serviceBaseUrl}/v2/setup/public/configured/check/${options.verification_type}`;
  VerificationService.checkVerificationTypeConfigured(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST");
});

test('initiateMFA', () => {
  const options: IInitVerificationAuthenticationRequestEntity = {
    usage_type: 'usage_type',
    processingType: 'processingType',
    request_id: 'request_id',
    type: 'type'
  };
  const serviceURL = `${serviceBaseUrl}/v2/authenticate/initiate/${options.type}`;
  VerificationService.initiateMFA(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST");
});

test('initiateMFA with access token', () => {
  const options: IInitVerificationAuthenticationRequestEntity = {
    usage_type: 'usage_type',
    processingType: 'processingType',
    request_id: 'request_id',
    type: 'type'
  };
  const accessToken = 'accessToken';
  const serviceURL = `${serviceBaseUrl}/v2/authenticate/initiate/${options.type}`;
  VerificationService.initiateMFA(options, accessToken);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST", accessToken);
});

test('authenticateMFA', () => {
  const options: IAuthVerificationAuthenticationRequestEntity = {
    type: 'type',
    exchange_id: 'exchange_id',
    client_id: 'client_id'
  };
  const serviceURL = `${serviceBaseUrl}/v2/authenticate/authenticate/${options.type}`;
  VerificationService.authenticateMFA(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST");
});