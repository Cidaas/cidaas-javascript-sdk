import * as LoginService from '../../src/main/login-service/LoginService';
import { Helper } from "../../src/main/common/Helper";
import { IChangePasswordEntity, IUserEntity } from '../../src/main/web-auth/Entities';
import { LoginWithCredentialsRequest, PasswordlessLoginRequest, SocialProviderPathParameter, SocialProviderQueryParameter } from '../../src/main/login-service/login.model';
import { LoginPrecheckRequest, VerificationType } from '../../src/main/common/common.model';

const authority = 'baseURL';
const serviceBaseUrl: string = `${authority}/login-srv`;
const createFormSpy = jest.spyOn(Helper, 'createForm');
const submitFormSpy = jest.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation();
const httpSpy = jest.spyOn(Helper, 'createHttpPromise');

beforeAll(() => {
  window.webAuthSettings = { authority: authority, client_id: '', redirect_uri: '' };
});

test('loginWithCredentials', () => {
  const option: LoginWithCredentialsRequest = {
    username: 'username',
    password: 'password',
    requestId: 'requestId'
  };
  const serviceURL = `${serviceBaseUrl}/login`;
  LoginService.loginWithCredentials(option);
  expect(createFormSpy).toHaveBeenCalledWith(serviceURL, option);
  expect(submitFormSpy).toHaveBeenCalled();
});

test('loginWithSocial', () => {
  Object.defineProperty(window, 'location', {
    value: {},
  });
  const options: SocialProviderPathParameter = { 
    provider: 'provider',
    requestId: 'requestId' 
  };
  const queryParams: SocialProviderQueryParameter = { 
    dc: 'dc',
    device_fp: 'device_fp' 
  };
  LoginService.loginWithSocial(options, queryParams);
  const serviceURL = `${serviceBaseUrl}/social/login/${options.provider.toLowerCase()}/${options.requestId}?dc=${queryParams.dc}&device_fp=${queryParams.device_fp}`;
  expect(window.location.href).toEqual(serviceURL);  
});

test('registerWithSocial', () => {
  Object.defineProperty(window, 'location', {
    value: {},
  });
  const options: SocialProviderPathParameter = { 
    provider: 'provider',
    requestId: 'requestId' 
  };
  const queryParams: SocialProviderQueryParameter = { 
    dc: 'dc',
    device_fp: 'device_fp' 
  };
  LoginService.registerWithSocial(options, queryParams);
  const serviceURL = `${serviceBaseUrl}/social/register/${options.provider.toLowerCase()}/${options.requestId}?dc=${queryParams.dc}&device_fp=${queryParams.device_fp}`;
  expect(window.location.href).toEqual(serviceURL);  
});

test('passwordlessLogin', () => {
  const option: PasswordlessLoginRequest = {
    requestId: 'requestId',
    sub: 'sub',
    status_id: 'statusId',
    verificationType: VerificationType.EMAIL
  };
  const serviceURL = `${serviceBaseUrl}/verification/login`;
  LoginService.passwordlessLogin(option);
  expect(createFormSpy).toHaveBeenCalledWith(serviceURL, option);
  expect(submitFormSpy).toHaveBeenCalled();
});

test('consentContinue', () => {
  const option: LoginPrecheckRequest = {
    track_id: 'track_id'
  };
  const serviceURL = `${serviceBaseUrl}/precheck/continue/${option.track_id}`;
  LoginService.consentContinue(option);
  expect(createFormSpy).toHaveBeenCalledWith(serviceURL, option);
  expect(submitFormSpy).toHaveBeenCalled();
});

test('mfaContinue', () => {
  const option: LoginPrecheckRequest = {
    track_id: 'track_id',
  };
  const serviceURL = `${serviceBaseUrl}/precheck/continue/${option.track_id}`;
  LoginService.mfaContinue(option);
  expect(createFormSpy).toHaveBeenCalledWith(serviceURL, option);
  expect(submitFormSpy).toHaveBeenCalled();
});

test('firstTimeChangePassword', () => {
  const option: IChangePasswordEntity = {
    sub: 'sub',
    old_password: 'old',
    new_password: 'new',
    confirm_password: 'new',
    loginSettingsId: 'loginSettingsId'
  };
  const serviceURL = `${serviceBaseUrl}/precheck/continue/${option.loginSettingsId}`;
  LoginService.firstTimeChangePassword(option);
  expect(createFormSpy).toHaveBeenCalledWith(serviceURL, option);
  expect(submitFormSpy).toHaveBeenCalled();
});

test('progressiveRegistration', () => {
  const options: IUserEntity = {
    userStatus: 'userStatus',
    user_status: 'user_status',
    user_status_reason: 'user_status_reason',
    username: 'username',
    sub: 'sub',
    given_name: 'given_name',
    family_name: 'family_name',
    middle_name: 'middle_name',
    nickname: 'nickname',
    email: 'email',
    email_verified: false,
    mobile_number: 'mobile_number',
    mobile_number_obj: null,
    mobile_number_verified: false,
    phone_number: 'phone_number',
    phone_number_obj: null,
    phone_number_verified: false,
    profile: 'profile',
    picture: 'picture',
    website: 'website',
    gender: 'gender',
    zoneinfo: 'zoneinfo',
    locale: 'locale',
    birthdate: null,
    password: 'password',
    provider: 'provider',
    providerUserId: 'providerUserId',
    identityId: 'identityId',
    roles: [],
    userGroups: [],
    rawJSON: 'rawJSON',
    trackId: 'trackId',
    need_reset_password: false
  };
  const headers = {
    requestId: 'requestId',
    trackId: 'trackId',
    acceptlanguage: 'acceptlanguage'
  }
  const serviceURL = `${serviceBaseUrl}/progressive/update/user`;
  void LoginService.progressiveRegistration(options, headers);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, 'POST', undefined, headers);
});

test('loginAfterRegister', () => {
  const option = {
    device_id: 'deviceId',
    dc: 'dc',
    rememberMe: false,
    trackId: 'trackId',
    device_fp: 'device_fp'
  };
  const serviceURL = `${serviceBaseUrl}/login/handle/afterregister/${option.trackId}`;
  LoginService.loginAfterRegister(option);
  expect(createFormSpy).toHaveBeenCalledWith(serviceURL, option);
});