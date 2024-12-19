import { VerificationService }  from './VerificationService';
import { Helper } from "../common/Helper";
import { AuthenticateMFARequest,  CancelMFARequest, CheckVerificationTypeConfiguredRequest, ConfigureFriendlyNameRequest, ConfigureVerificationRequest, EnrollVerificationRequest, GetMFAListRequest, InitiateAccountVerificationRequest, InitiateEnrollmentRequest, InitiateMFARequest, InitiateVerificationRequest, VerifyAccountRequest } from './VerificationService.model';
import { OidcSettings } from '../authentication/Authentication.model';
import ConfigUserProvider from '../common/ConfigUserProvider';

const authority = 'baseURL';
const serviceBaseUrl: string = `${authority}/verification-srv`;
const actionsServiceBaseUrl: string = `${authority}/verification-actions-srv`;
const createFormSpy = jest.spyOn(Helper, 'createForm');
const submitFormSpy = jest.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation();
const httpSpy = jest.spyOn(Helper, 'createHttpPromise');
let verificationService: VerificationService;

beforeAll(() => {
  const options: OidcSettings = {
    authority: authority,
    client_id: '',
    redirect_uri: ''
  };
  const configUserProvider: ConfigUserProvider = new ConfigUserProvider(options);
  verificationService = new VerificationService(configUserProvider);
});

test('initiateAccountVerification', () => {
  const options: InitiateAccountVerificationRequest = {
    sub: '123'
  };
  const serviceURL = `${serviceBaseUrl}/account/initiate`;
  verificationService.initiateAccountVerification(options);
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
  verificationService.verifyAccount(options, headers);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST", undefined, headers);
});

describe('getMFAList', () => {
  test('getMFAListWithEmail', () => {
    const options: GetMFAListRequest = {
      request_id: 'request_id',
      email: 'email'
    };
    const serviceURL = `${serviceBaseUrl}/v2/setup/public/configured/list`;
    verificationService.getMFAList(options);
    expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST", undefined, undefined);
  });
  
  test('getMFAListWithMobile', () => {
    const options: GetMFAListRequest = {
      request_id: 'request_id',
      mobile_number: 'mobile_number'
    };
    const serviceURL = `${serviceBaseUrl}/v2/setup/public/configured/list`;
    verificationService.getMFAList(options);
    expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST", undefined, undefined);
  });
  
  test('getMFAListWithUsername', () => {
    const options: GetMFAListRequest = {
      request_id: 'request_id',
      username: 'username'
    };
    const serviceURL = `${serviceBaseUrl}/v2/setup/public/configured/list`;
    verificationService.getMFAList(options);
    expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST", undefined, undefined);
  });
  
  test('getMFAListWithMaskedSub', () => {
    const options: GetMFAListRequest = {
      request_id: 'request_id',
      sub: 'masked sub'
    };
    const serviceURL = `${serviceBaseUrl}/v2/setup/public/configured/list`;
    verificationService.getMFAList(options);
    expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST", undefined, undefined);
  });

  test('getMFAListWithQ', () => {
    const options: GetMFAListRequest = {
      request_id: 'request_id',
      q: 'masked sub'
    };
    const serviceURL = `${serviceBaseUrl}/v2/setup/public/configured/list`;
    verificationService.getMFAList(options);
    expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST", undefined, undefined);
  });
});

test('cancelMFA', () => {
  const options: CancelMFARequest = {
    exchange_id: 'exchange_id',
    reason: 'reason',
    type: 'type'
  };
  const serviceURL = `${serviceBaseUrl}/v2/authenticate/cancel/${options.type}`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  verificationService.cancelMFA(options, headers);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST", undefined, headers);
});

test('getAllVerificationList', () => {
  const accessToken = 'accessToken';
  const serviceURL = `${serviceBaseUrl}/config/list`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  verificationService.getAllVerificationList(accessToken, headers);
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
  verificationService.initiateEnrollment(options, accessToken);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST", accessToken);
});

test('getEnrollmentStatus', () => {
  const status_id = 'status_id';
  const accessToken = 'accessToken';
  const serviceURL = `${serviceBaseUrl}/v2/notification/status/${status_id}`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  verificationService.getEnrollmentStatus(status_id, accessToken, headers);
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
  verificationService.enrollVerification(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST");
});

test('checkVerificationTypeConfigured', () => {
  const options: CheckVerificationTypeConfiguredRequest = {
    email: 'email',
    request_id: 'request_id',
    verification_type: 'verification_type'
  };
  const serviceURL = `${serviceBaseUrl}/v2/setup/public/configured/check/${options.verification_type}`;
  verificationService.checkVerificationTypeConfigured(options);
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
  verificationService.initiateMFA(options, undefined, headers);
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
  verificationService.initiateMFA(options, accessToken);
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
  verificationService.authenticateMFA(options, headers);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST", undefined, headers);
});

test('initiateVerification', () => {
  const options: InitiateVerificationRequest = {
    email: 'email'
  };
  const trackId = 'trackId';
  const method = 'method';
  const serviceURL = `${actionsServiceBaseUrl}/setup/${method}/initiate/${trackId}`;
  verificationService.initiateVerification(options, trackId, method);
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
  verificationService.configureVerification(options, method);
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
  verificationService.configureFriendlyName(options, trackId, method);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, 'PUT');
});