import { AcceptResetPasswordEntity, ChangePasswordEntity, FindUserEntity, IUserLinkEntity, ResetPasswordEntity, UserEntity, ValidateResetPasswordEntity } from '../../src/main/web-auth/Entities';
import { Helper } from '../../src/main/web-auth/Helper';
import { UserService } from '../../src/main/web-auth/UserService';

const authority = 'baseURL';
const serviceBaseUrl: string = `${authority}/users-srv`;
const serviceBaseUrlUsersActions: string = `${authority}/useractions-srv`;
const createFormSpy = jest.spyOn(Helper, 'createForm');
const submitFormSpy = jest.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation();
const httpSpy = jest.spyOn(Helper, 'createHttpPromise');

beforeAll(() => {
	(window as any).webAuthSettings = { authority: authority }
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
  const options: UserEntity = {
		given_name: 'given_name',
		family_name: 'family_name',
		email: 'email',
		password: 'password',
		password_echo: 'password_echo'
	};
	const headers = {
		requestId: 'requestId'
	}
  const serviceURL = `${serviceBaseUrl}/register`;
  UserService.register(options, headers);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST', undefined, headers);
});

test('getInviteUserDetails', () => {
  const options = {
    invite_id: 'invite_id',
  };
  const serviceURL = `${serviceBaseUrl}/invite/info/${options.invite_id}`;
  UserService.getInviteUserDetails(options);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET');
});

test('getUserInvitationV2', () => {
  const options = {
      inviteId: 'inviteId',
  };
  const serviceURL = `${serviceBaseUrlUsersActions}/invitations/${options.inviteId}`;
  UserService.getUserInvitationV2(options);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET');
});

test('getCommunicationStatus', () => {
  const options = {
    sub: 'sub',
  };
	const headers = {
		requestId: 'requestId'
	}
  const serviceURL = `${serviceBaseUrl}/user/communication/status/${options.sub}`;
  UserService.getCommunicationStatus(options, headers);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET', undefined, headers);
});

test('initiateResetPassword', () => {
  const options: ResetPasswordEntity = {
		email: 'email',
		resetMedium: 'EMAIL',
		processingType: 'CODE',
		requestId: 'requestId'
	};
  const serviceURL = `${serviceBaseUrl}/resetpassword/initiate`;
  UserService.initiateResetPassword(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST');
});

test('handleResetPassword', () => {
  const options: ValidateResetPasswordEntity = {
		resetRequestId: 'resetRequestId',
		code: 'code'
	};
  const serviceURL = `${serviceBaseUrl}/resetpassword/validatecode`;
  UserService.handleResetPassword(options);
	expect(createFormSpy).toHaveBeenCalledWith(serviceURL, options);
	expect(submitFormSpy).toHaveBeenCalled();
});

test('handleResetPassword with json response', () => {
  const options: ValidateResetPasswordEntity = {
		resetRequestId: 'resetRequestId',
		code: 'code'
	};
  const serviceURL = `${serviceBaseUrl}/resetpassword/validatecode`;
  UserService.handleResetPassword(options, true);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST');
});

test('resetPassword', () => {
  const options: AcceptResetPasswordEntity = {
		resetRequestId: 'resetRequestId',
		exchangeId: 'exchangeId',
		password: 'password',
		confirmPassword: 'confirmPassword'
	};
  const serviceURL = `${serviceBaseUrl}/resetpassword/accept`;
  UserService.resetPassword(options);
	expect(createFormSpy).toHaveBeenCalledWith(serviceURL, options);
	expect(submitFormSpy).toHaveBeenCalled();
});

test('resetPassword with json response', () => {
  const options: AcceptResetPasswordEntity = {
		resetRequestId: 'resetRequestId',
		exchangeId: 'exchangeId',
		password: 'password',
		confirmPassword: 'confirmPassword'
	};
  const serviceURL = `${serviceBaseUrl}/resetpassword/accept`;
  UserService.resetPassword(options, true);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST');
});

test('getDeduplicationDetails', () => {
  const options = {
		trackId: 'trackId'
	};
  const serviceURL = `${serviceBaseUrl}/deduplication/info/${options.trackId}`;
  UserService.getDeduplicationDetails(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'GET');
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
  UserService.registerDeduplication(options);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, undefined, 'POST');
});

test('changePassword', () => {
  const options: ChangePasswordEntity = {
    sub: 'sub',
    identityId: 'identityId',
    old_password: 'old_password',
    new_password: 'new_password',
    confirm_password: 'confirm_password',
    accessToken: 'accessToken'
  };
  const accessToken = 'accessToken';
  const serviceURL = `${serviceBaseUrl}/changepassword`;
  UserService.changePassword(options, accessToken);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST', accessToken);
});

test('updateProfile', () => {
  const options: UserEntity = {
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
  const mockDate = new Date('1970-01-01T00:00:00Z');
  const options: IUserLinkEntity = {
    master_sub: 'master_sub',
    user_name_type: 'email',
    user_name_to_link: 'user_name_to_link',
    link_accepted_by: 'link_accepted_by',
    link_response_time: mockDate,
    link_accepted: false,
    communication_type: 'communication_type',
    verification_status_id: 'verification_status_id',
    type: 'type',
    status: 'status'
  };
  const accessToken = 'accessToken';
  const serviceURL = `${serviceBaseUrl}/user/link/initiate`;
  UserService.initiateLinkAccount(options, accessToken);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST', accessToken);
});

test('completeLinkAccount', () => {
  const options = {
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
  const options = {
    access_token: 'access_token',
    sub: 'sub'
  };
  const serviceURL = `${serviceBaseUrl}/user/unregister/scheduler/schedule/${options.sub}`;
  UserService.deleteUserAccount(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, 'POST', options.access_token);
});

test('userCheckExists', () => {
  const options: FindUserEntity = {
    sub: 'sub',
    email: 'email',
    mobile: 'mobile',
    username: 'username',
    customFields: undefined,
    provider: 'provider',
    providerUserId: 'providerUserId',
    rememberMe: 'rememberMe',
    webfinger: 'webfinger',
    sub_not: 'sub_not',
    requestId: 'requestId'
  };
  const queryParameter = `?webfinger=${options.webfinger}&rememberMe=${options.rememberMe}`
  const serviceURL = `${authority}/useractions-srv/userexistence/${options.requestId}${queryParameter}`;
  UserService.userCheckExists(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, 'POST');
});
