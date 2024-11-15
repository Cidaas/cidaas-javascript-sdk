import { Helper } from '../common/Helper';
import { CidaasUser } from '../common/User.model';
import * as UserService from './UserService';
import { ChangePasswordRequest, CompleteLinkAccountRequest, DeleteUserAccountRequest, HandleResetPasswordRequest, InitiateLinkAccountRequest, InitiateResetPasswordRequest, RegisterRequest, ResetPasswordRequest, UserCheckExistsRequest } from './UserService.model';

const authority = 'baseURL';
const serviceBaseUrl: string = `${authority}/users-srv`;
const serviceBaseUrlUsersActions: string = `${authority}/useractions-srv`;
const createFormSpy = jest.spyOn(Helper, 'createForm');
const submitFormSpy = jest.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation();
const httpSpy = jest.spyOn(Helper, 'createHttpPromise');

beforeAll(() => {
	window.webAuthSettings = { authority: authority, client_id: '', redirect_uri: '' };
});

test('getUserProfile', () => {
  const options = {
    access_token: 'access_token',
  };
  const serviceURL = `${serviceBaseUrl}/userinfo`;
  UserService.getUserProfile(options);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, undefined, 'GET', options.access_token);
});

test('register', () => {
  const options: RegisterRequest = {
		given_name: 'given_name',
		family_name: 'family_name',
		email: 'email',
		password: 'password',
		password_echo: 'password_echo'
	};
	const headers = {
		requestId: 'requestId',
    lat: 'latitude',
    lon: 'longitude'
	}
  const serviceURL = `${serviceBaseUrl}/register`;
  UserService.register(options, headers);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST', undefined, headers);
});

test('getInviteUserDetails: to use older api, if no callLatestApi is present', () => {
    const options = {
        invite_id: 'invite_id',
    };
    const serviceURL = `${serviceBaseUrl}/invite/info/${options.invite_id}`;
    const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
    UserService.getInviteUserDetails(options, headers);
    expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET', undefined, headers);
});

test('getInviteUserDetails using latest api', () => {
  const options = {
    invite_id: 'invite_id',
    callLatestAPI: true
  };
  const serviceURL = `${serviceBaseUrlUsersActions}/invitations/${options.invite_id}`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  UserService.getInviteUserDetails(options, headers);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET', undefined, headers);
});

test('getInviteUserDetails using older api', () => {
  const options = {
    invite_id: 'invite_id',
    callLatestAPI: false
  };
  const serviceURL = `${serviceBaseUrl}/invite/info/${options.invite_id}`;
  UserService.getInviteUserDetails(options);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET', undefined, undefined);
});


test('getCommunicationStatus', () => {
  const options = {
    sub: 'sub',
  };
	const headers = {
		requestId: 'requestId',
    lat: 'latitude',
    lon: 'longitude'
	}
  const serviceURL = `${serviceBaseUrl}/user/communication/status/${options.sub}`;
  UserService.getCommunicationStatus(options, headers);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET', undefined, headers);
});

test('initiateResetPassword', () => {
  const options: InitiateResetPasswordRequest = {
		email: 'email',
		resetMedium: 'EMAIL',
		processingType: 'CODE',
		requestId: 'requestId'
	};
  const serviceURL = `${serviceBaseUrl}/resetpassword/initiate`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  UserService.initiateResetPassword(options, headers);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST', undefined, headers);
});

test('handleResetPassword', () => {
  const options: HandleResetPasswordRequest = {
		resetRequestId: 'resetRequestId',
		code: 'code'
	};
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  const serviceURL = `${serviceBaseUrl}/resetpassword/validatecode`;
  UserService.handleResetPassword(options, undefined, headers);
	expect(createFormSpy).toHaveBeenCalledWith(serviceURL, options);
	expect(submitFormSpy).toHaveBeenCalled();
});

test('handleResetPassword with json response', () => {
  const options: HandleResetPasswordRequest = {
		resetRequestId: 'resetRequestId',
		code: 'code'
	};
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  const serviceURL = `${serviceBaseUrl}/resetpassword/validatecode`;
  UserService.handleResetPassword(options, true, headers);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST', undefined, headers);
});

test('resetPassword', () => {
  const options: ResetPasswordRequest = {
		resetRequestId: 'resetRequestId',
		exchangeId: 'exchangeId',
		password: 'password',
		confirmPassword: 'confirmPassword'
	};
  const serviceURL = `${serviceBaseUrl}/resetpassword/accept`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  UserService.resetPassword(options, undefined, headers);
	expect(createFormSpy).toHaveBeenCalledWith(serviceURL, options);
	expect(submitFormSpy).toHaveBeenCalled();
});

test('resetPassword with json response', () => {
  const options: ResetPasswordRequest = {
		resetRequestId: 'resetRequestId',
		exchangeId: 'exchangeId',
		password: 'password',
		confirmPassword: 'confirmPassword'
	};
  const serviceURL = `${serviceBaseUrl}/resetpassword/accept`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  UserService.resetPassword(options, true, headers);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST', undefined, headers);
});

test('getDeduplicationDetails', () => {
  const options = {
		trackId: 'trackId'
	};
  const serviceURL = `${serviceBaseUrl}/deduplication/info/${options.trackId}`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  UserService.getDeduplicationDetails(options, headers);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'GET', undefined, headers);
});

test('deduplicationLogin', () => {
  const options = {
		trackId: 'trackId',
		requestId: 'requestId',
		sub: 'sub'
	};
  const serviceURL = `${serviceBaseUrl}/deduplication/login/redirection?trackId=${options.trackId}&requestId=${options.requestId}&sub=${options.sub}`;
  UserService.deduplicationLogin(options);
	expect(createFormSpy).toHaveBeenCalledWith(serviceURL, {});
	expect(submitFormSpy).toHaveBeenCalled();
});

test('registerDeduplication', () => {
  const options = {
		trackId: 'trackId'
	};
  const serviceURL = `${serviceBaseUrl}/deduplication/register/${options.trackId}`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  UserService.registerDeduplication(options, headers);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, undefined, 'POST', undefined, headers);
});

test('changePassword', () => {
  const options: ChangePasswordRequest = {
    sub: 'sub',
    identityId: 'identityId',
    old_password: 'old_password',
    new_password: 'new_password',
    confirm_password: 'confirm_password',
  };
  const accessToken = 'accessToken';
  const serviceURL = `${serviceBaseUrl}/changepassword`;
  UserService.changePassword(options, accessToken);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST', accessToken);
});

test('updateProfile', () => {
  const options: CidaasUser = {
    given_name: 'given_name',
		family_name: 'family_name',
		email: 'email',
		password: 'password',
		password_echo: 'password_echo'
  };
  const accessToken = 'accessToken';
  const sub = 'sub';
  const serviceURL = `${serviceBaseUrl}/user/profile/${sub}`;
  UserService.updateProfile(options, accessToken, sub);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'PUT', accessToken);
});

test('initiateLinkAccount', () => {
  const options: InitiateLinkAccountRequest = {
    master_sub: 'master_sub',
    user_name_type: 'email',
    user_name_to_link: 'user_name_to_link'
  };
  const accessToken = 'accessToken';
  const serviceURL = `${serviceBaseUrl}/user/link/initiate`;
  UserService.initiateLinkAccount(options, accessToken);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST', accessToken);
});

test('completeLinkAccount', () => {
  const options: CompleteLinkAccountRequest = {
    code: 'code',
    link_request_id: 'link_request_id'
  };
  const accessToken = 'accessToken';
  const serviceURL = `${serviceBaseUrl}/user/link/complete`;
  UserService.completeLinkAccount(options, accessToken);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST', accessToken);
});

test('getLinkedUsers', () => {
  const accessToken = 'accessToken';
  const sub = 'sub';
  const serviceURL = `${serviceBaseUrl}/userinfo/social/${sub}`;
  UserService.getLinkedUsers(accessToken, sub);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET', accessToken);
});

test('unlinkAccount', () => {
  const accessToken = 'accessToken';
  const identityId = 'identityId';
  const serviceURL = `${serviceBaseUrl}/user/unlink/${identityId}`;
  UserService.unlinkAccount(accessToken, identityId);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'POST', accessToken);
});

test('deleteUserAccount', () => {
  const options: DeleteUserAccountRequest = {
    access_token: 'access_token',
    sub: 'sub'
  };
  const serviceURL = `${serviceBaseUrl}/user/unregister/scheduler/schedule/${options.sub}`;
  UserService.deleteUserAccount(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, 'POST', options.access_token);
});

test('userCheckExists', () => {
  const options: UserCheckExistsRequest = {
    email: 'email',
    mobile: 'mobile',
    username: 'username',
    rememberMe: 'rememberMe',
    webfinger: 'webfinger',
    requestId: 'requestId'
  };
  const queryParameter = `?webfinger=${options.webfinger}&rememberMe=${options.rememberMe}`
  const serviceURL = `${authority}/useractions-srv/userexistence/${options.requestId}${queryParameter}`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  UserService.userCheckExists(options, headers);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, 'POST', undefined, headers);
});
