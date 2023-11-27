declare global {
  interface Window {
    webAuthSettings: {
      authority: string;
      // Add other properties if needed
    };
  }
}

import { Helper } from '../../src/main/web-auth/Helper';
import {
  UserService,
} from '../../src/main/web-auth/UserService';
import {
  AcceptResetPasswordEntity,
  ChangePasswordEntity,
  FindUserEntity, IUserLinkEntity, ResetPasswordEntity, UserEntity, ValidateResetPasswordEntity
} from "../../src/main/web-auth/Entities"

const authority = 'baseURL';
const serviceBaseUrl: string = `${authority}/users-srv`;
const serviceBaseUrl1: string = `${authority}/useractions-srv/userexistence`
const httpSpy = jest.spyOn(Helper, 'createHttpPromise');
const formSpy = jest.spyOn(Helper, 'createForm');
const cidaas_version = 3;

beforeAll(() => {
  (window as any).webAuthSettings = { authority: authority }
});

test('getUserProfile', () => {
  let options = {
    access_token: 'access_token',
  }
  const serviceURL = `${serviceBaseUrl}/userinfo`;
  UserService.getUserProfile(options);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, undefined, 'GET', options.access_token);
});

test('getInviteUserDetails', () => {
  let options = {
    invite_id: 'invite_id',
  }
  const serviceURL = `${serviceBaseUrl}/invite/info/${options.invite_id}`;
  UserService.getInviteUserDetails(options);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET');
});

test('initiateResetPassword', () => {
  let options: ResetPasswordEntity = {
    email: 'testertest@widas.de',
    resetMedium: 'EMAIL',
    processingType: 'LINK',
    requestId: '12345'
  }
  const serviceURL = `${serviceBaseUrl}/resetpassword/initiate`;
  UserService.initiateResetPassword(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST');
});

test('register', () => {
  let options: UserEntity = {
    email: 'testertest@widas.de',
    given_name: 'tester',
    family_name: 'sample',
    password: '123456',
    password_echo: '123456'
  }
  const headers = {
    requestId: 'requestId',
  };
  const serviceURL = `${serviceBaseUrl}/register`;
  UserService.register(options, headers);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST', undefined, headers);
});

test('getCommunicationStatus', () => {
  let options = {
    sub: '12345',
    requestId: '123'
  }
  let headers ={
    requestId: '123'
  }
  const serviceURL = `${serviceBaseUrl}/user/communication/status/${options.sub}`;
  UserService.getCommunicationStatus(options);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET', undefined, headers);
});

test('handleResetPassword', () => {
  let options: ValidateResetPasswordEntity = {
    resetRequestId: '21334',
    code: '1234'
  }
  const serviceURL = `${serviceBaseUrl}/resetpassword/validatecode`;
  UserService.handleResetPassword(options);
  if (cidaas_version > 2) {
    expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST');
  }
});

test('resetPassword', () => {
  let options: AcceptResetPasswordEntity = {
    resetRequestId: 'resetRequestId',
    exchangeId: 'exchangeId',
    password: '12345',
    confirmPassword: '12345'
  }
  const serviceURL = `${serviceBaseUrl}/resetpassword/accept`;
  UserService.resetPassword(options);
  if (cidaas_version > 2) {
    expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST');
  } else {
    expect(formSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST');
  }
});

test('updateProfile', () => {
  const options: UserEntity = {
    email: 'email',
    given_name: 'tester',
    family_name: 'sample',
    password: '123456',
    password_echo: '123456'
  }
  let access_token = 'access_token';
  let sub = 'sub'
  const serviceURL = `${serviceBaseUrl}/user/profile/${sub}`;
  UserService.updateProfile(options, access_token, sub);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'PUT', access_token);
});


test('getDeduplicationDetails', () => {
  let options = {
    trackId: '12345'
  }
  const serviceURL = `${serviceBaseUrl}/deduplication/info/${options.trackId}`;
  UserService.getDeduplicationDetails(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'GET', undefined);
});

test('registerDeduplication', () => {
  let options = {
    trackId: '12345'
  }
  const serviceURL = `${serviceBaseUrl}/deduplication/register/${options.trackId}`;
  UserService.registerDeduplication(options);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, undefined, 'POST');
});

test('changePassword', () => {
  let options: ChangePasswordEntity = {
    sub: 'sub',
    identityId: 'identityId',
    old_password: '123',
    new_password: '1234',
    confirm_password: '1234'
  }
  let headers ={
    accessToken: 'accessToken'
  }
  const serviceURL = `${serviceBaseUrl}/changepassword`;
  UserService.changePassword(options, headers.accessToken);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST', headers.accessToken);
});

test('initiateLinkAccount', () => {
  let options: IUserLinkEntity = {
    master_sub: 'sub',
    user_name_type: '',
    user_name_to_link: '',
    link_accepted_by: '',
    link_response_time: new Date(),
    link_accepted: false,
    communication_type: '',
    verification_status_id: '',
    type: '',
    status: ''
  }
  let headers = {
    accessToken: 'accessToken'
  }
  const serviceURL = `${serviceBaseUrl}/user/link/initiate`;
  UserService.initiateLinkAccount(options, headers.accessToken);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST', headers.accessToken);
});

test('completeLinkAccount', () => {
  let options = {
    code: 'code',
    link_request_id: ''
  }
  let headers = {
    accessToken: 'accessToken'
  }
  const serviceURL = `${serviceBaseUrl}/user/link/complete`;
  UserService.completeLinkAccount(options, headers.accessToken);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST', headers.accessToken);
});

test('getLinkedUsers', () => {
  let options: any = {
    access_token: 'access_token',
    sub: 'sub'
  }
  const serviceURL = `${serviceBaseUrl}/userinfo/social/${options.sub}`;
  UserService.getLinkedUsers(options.access_token, options.sub);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET', options.access_token);
});

test('unlinkAccount', () => {
  let options = {
    identityId: '',
    access_token: ''
  }
  const serviceURL = `${serviceBaseUrl}/user/unlink/${options.identityId}`;
  UserService.unlinkAccount(options.access_token, options.identityId);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'POST', options.access_token);
});

test('deleteUserAccount', () => {
  let options = {
    sub: '',
    access_token: ''
  }
  const serviceURL = `${serviceBaseUrl}/user/unregister/scheduler/schedule/${options.sub}`;
  UserService.deleteUserAccount(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, 'POST', options.access_token);
});

test('userCheckExists', () => {
  let options: FindUserEntity = {
    sub: '',
    email: '',
    mobile: '',
    username: '',
    customFields: undefined,
    provider: '',
    providerUserId: '',
    rememberMe: 'true',
    webfinger: 'no_redirection',
    requestId: '1234',
    sub_not: ''
  }
  const serviceURL = `${serviceBaseUrl1}/${options.requestId}?webfinger=${options.webfinger}&rememberMe=${options.rememberMe}`;
  UserService.userCheckExists(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, 'POST');
});

test('deduplicationLogin', () => {
  const options = {
    trackId: 'testTrackId',
    requestId: 'testRequestId',
    sub: 'testSub',
  };
  
  window.webAuthSettings = {
    authority: `${serviceBaseUrl}/deduplication/login/redirection?trackId=${options.trackId}&requestId=${options.requestId}&sub=${options.sub}`, // Replace with your actual authority URL
  };
   // Create a mock function to replace form.submit
   const formSubmitMock = jest.fn();
   // Create a spy on the form's submit method and replace it with the mock function
   const formSubmitSpy = jest.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation(formSubmitMock);
   // Call the function to be tested
   UserService.deduplicationLogin(options);
   // Assert that the form's submit method was called
   expect(formSubmitSpy).toHaveBeenCalled();
   // Clean up by restoring the original submit method
   formSubmitSpy.mockRestore();
   // Assert that the formSubmitMock was called with the expected URL
   expect(formSubmitMock).toHaveBeenCalledWith(); 
});
