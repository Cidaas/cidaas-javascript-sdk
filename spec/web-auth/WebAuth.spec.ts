import { WebAuth } from '../../src/main';
import { AccessTokenRequest, TokenIntrospectionEntity } from '../../src/main/token/token.model';
import * as ConsentService from '../../src/main/web-auth/ConsentService';
import { AcceptResetPasswordEntity, AccountVerificationRequestEntity, ChangePasswordEntity, FindUserEntity, IAuthVerificationAuthenticationRequestEntity, IChangePasswordEntity, IConfiguredListRequestEntity, IConsentAcceptEntity, IEnrollVerificationSetupRequestEntity, IInitVerificationAuthenticationRequestEntity, IUserActivityPayloadEntity, IUserEntity, IUserLinkEntity, LoginFormRequestEntity, PhysicalVerificationLoginRequest, ResetPasswordEntity, UserEntity, ValidateResetPasswordEntity } from '../../src/main/web-auth/Entities';
import { Helper } from '../../src/main/web-auth/Helper';
import * as LoginService from '../../src/main/web-auth/LoginService';
import * as TokenService from '../../src/main/web-auth/TokenService';
import * as UserService from '../../src/main/web-auth/UserService';
import * as VerificationService from '../../src/main/web-auth/VerificationService';
import { SigninRequest } from 'oidc-client-ts';

const authority = 'baseURL';
const httpSpy = jest.spyOn(Helper, 'createHttpPromise');
const options = {
	authority: 'baseURL',
	client_id: 'clientId',
	redirect_uri: 'redirectUri',
	post_logout_redirect_uri: 'logoutUri',
	response_type: 'code',
	scope: 'scope'
};
const webAuth = new WebAuth(options);
const mockDate = new Date('1970-01-01T00:00:00Z');

describe('Webauth functions without module or services', () => {
	test('doNotRemoveAuthorityTrailingSlashIfNotExist', () => {
		const optionsWithoutTrailingSlashAuthority = {
			authority: 'https://domain/path',
			client_id: 'clientId',
			redirect_uri: 'redirectUri',
			post_logout_redirect_uri: 'logoutUri',
			response_type: 'code',
			scope: 'scope'
		};
		new WebAuth(optionsWithoutTrailingSlashAuthority);
		expect(window.webAuthSettings.authority).toEqual('https://domain/path');
		new WebAuth(options);
	});
	
	test('removeAuthorityTrailingSlashIfExist', () => {
		const optionsWithTrailingSlashAuthority = {
			authority: 'https://domain/path/',
			client_id: 'clientId',
			redirect_uri: 'redirectUri',
			post_logout_redirect_uri: 'logoutUri',
			response_type: 'code',
			scope: 'scope'
		};
		new WebAuth(optionsWithTrailingSlashAuthority);
		expect(window.webAuthSettings.authority).toEqual('https://domain/path');
		new WebAuth(options);
	});

	test('getUserInfo', () => {
		const getUserSpy = jest.spyOn(window.usermanager, 'getUser');
		void webAuth.getUserInfo();
		expect(getUserSpy).toHaveBeenCalled();
	});
	
	test('getLoginURL', () => {
		const createSigninRequestSpy = jest.spyOn(window.usermanager.getClient(), 'createSigninRequest').mockResolvedValue({ url: 'empty' } as SigninRequest);
		void webAuth.getLoginURL();
		expect(createSigninRequestSpy).toHaveBeenCalled();
	});
	
	test('getRequestId', () => {
		jest.useFakeTimers();
		jest.setSystemTime(mockDate);
		const options = {
			'client_id': window.webAuthSettings.client_id,
			'redirect_uri': window.webAuthSettings.redirect_uri,
			'response_type': window.webAuthSettings.response_type,
			"response_mode": 'fragment',
			"scope": window.webAuthSettings.scope,
			"nonce": mockDate.getTime().toString()
		};
		const serviceURL = `${authority}/authz-srv/authrequest/authz/generate`;
		void webAuth.getRequestId();
		jest.useRealTimers();
		expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST');
	});
	
	test('getTenantInfo', () => {
		const serviceURL = `${authority}/public-srv/tenantinfo/basic`;
		void webAuth.getTenantInfo();
		expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET');
	});
	
	test('logoutUser', () => {
		Object.defineProperty(window, 'location', {
			value: {
				href: authority
			}
		});
		const options = {
			access_token: 'accessToken'
		};
		const serviceURL = `${authority}/session/end_session?access_token_hint=${options.access_token}&post_logout_redirect_uri=${window.webAuthSettings.post_logout_redirect_uri}`;
		webAuth.logoutUser(options);
		expect(window.location.href).toBe(serviceURL);
	});
	
	test('getClientInfo', () => {
		const options = {
			requestId: 'requestId'
		};
		const serviceURL = `${authority}/public-srv/public/${options.requestId}`;
		void webAuth.getClientInfo(options);
		expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET');
	});
	
	test('getDevicesInfo', () => {
		const acccessToken = 'accessToken';
		const serviceURL = `${authority}/device-srv/devices`;
		void webAuth.getDevicesInfo(undefined, acccessToken);
		expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET', acccessToken);
	});
	
	test('deleteDevice', () => {
		const options = {
			device_id: 'device_id'
		};
		const acccessToken = 'accessToken';
		const serviceURL = `${authority}/device-srv/device/${options.device_id}`;
		void webAuth.deleteDevice(options, acccessToken);
		expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'DELETE', acccessToken);
	});
	
	test('getRegistrationSetup', () => {
		const options = {
			acceptlanguage: 'acceptlanguage',
			requestId: 'requestId'
		};
		const serviceURL = `${authority}/registration-setup-srv/public/list?acceptlanguage=${options.acceptlanguage}&requestId=${options.requestId}`;
		void webAuth.getRegistrationSetup(options);
		expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET');
	});
	
	test('createDeviceInfo', () => {
		const options = {
			userAgent: window.navigator.userAgent
		};
		const serviceURL = `${authority}/device-srv/deviceinfo`;
		void webAuth.createDeviceInfo();
		expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST');
	});

	test('getUserActivities', () => {
		const options: IUserActivityPayloadEntity = {
			sub: '',
			dateFilter: {
				from_date: '',
				to_date: ''
			}
		};
		const accessToken = '';
		const serviceURL = `${authority}/activity-streams-srv/user-activities`;
		void webAuth.getUserActivities(options, accessToken);
		expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST', accessToken);
	});
	
	test('updateProfileImage', () => {
		const options = {
			image_key: 'imageKey',
			photo: new Blob(),
			filename: 'filename'
		};
		const accessToken = 'accessToken';
		const serviceURL = `${authority}/image-srv/profile/upload`;
	
		const form = document.createElement('form');
		form.action = serviceURL;
		form.method = 'POST';
		const image_key = document.createElement('input');
		image_key.setAttribute('type', 'hidden');
		image_key.setAttribute('name', 'image_key');
		form.appendChild(image_key);
		const photo = document.createElement('input');
		photo.setAttribute('type', 'file');
		photo.setAttribute('hidden', 'true');
		photo.setAttribute("name", "photo");
		form.appendChild(photo);
		const formdata = new FormData(form);
		formdata.set('image_key', options.image_key);
		formdata.set('photo', options.photo, options.filename);
	
		void webAuth.updateProfileImage(options, accessToken);
		expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, 'POST', accessToken, null, formdata);
	});
	
	test('setAcceptLanguageHeader', () => {
		const locale = 'en-gb'
		webAuth.setAcceptLanguageHeader(locale);
		expect(window.localeSettings).toBe(locale);
	});
});

// Authentication Module
describe('Authentication module functions', () => {
	test('loginWithBrowser', () => {
		const loginOrRegisterWithBrowserSpy = jest.spyOn(window.authentication, 'loginOrRegisterWithBrowser').mockResolvedValue(null);
		void webAuth.loginWithBrowser();
		expect(loginOrRegisterWithBrowserSpy).toHaveBeenCalledWith('login', undefined);
	});
	
	test('popupSignIn', () => {
		const popupSignInSpy = jest.spyOn(window.authentication, 'popupSignIn').mockImplementation();
		void webAuth.popupSignIn();
		expect(popupSignInSpy).toHaveBeenCalled();
	});
	
	test('silentSignIn', () => {
		const silentSignInSpy = jest.spyOn(window.authentication, 'silentSignIn').mockResolvedValue(null);
		void webAuth.silentSignIn();
		expect(silentSignInSpy).toHaveBeenCalled();
	});
	
	test('registerWithBrowser', () => {
		const loginOrRegisterWithBrowserSpy = jest.spyOn(window.authentication, 'loginOrRegisterWithBrowser').mockResolvedValue(null);
		void webAuth.registerWithBrowser();
		expect(loginOrRegisterWithBrowserSpy).toHaveBeenCalledWith('register', undefined);
	});
	
	test('loginCallback', () => {
		const loginCallbackSpy = jest.spyOn(window.authentication, 'loginCallback').mockResolvedValue(null);
		void webAuth.loginCallback();
		expect(loginCallbackSpy).toHaveBeenCalled();
	});
	
	test('popupSignInCallback', () => {
		const popupSignInCallbackSpy = jest.spyOn(window.authentication, 'popupSignInCallback').mockResolvedValue(null);
		void webAuth.popupSignInCallback();
		expect(popupSignInCallbackSpy).toHaveBeenCalled();
	});
	
	test('silentSignInCallback', () => {
		const silentSignInCallbackSpy = jest.spyOn(window.authentication, 'silentSignInCallback').mockResolvedValue(null);
		void webAuth.silentSignInCallback();
		expect(silentSignInCallbackSpy).toHaveBeenCalled();
	});
	
	test('logout', () => {
		const logoutSpy = jest.spyOn(window.authentication, 'logout').mockResolvedValue(null);
		void webAuth.logout();
		expect(logoutSpy).toHaveBeenCalled();
	});
	
	test('popupSignOut', () => {
		const popupSignOutSpy = jest.spyOn(window.authentication, 'popupSignOut').mockImplementation();
		void webAuth.popupSignOut();
		expect(popupSignOutSpy).toHaveBeenCalled();
	});
	
	test('logoutCallback', () => {
		const logoutCallbackSpy = jest.spyOn(window.authentication, 'logoutCallback').mockResolvedValue(null);
		void webAuth.logoutCallback();
		expect(logoutCallbackSpy).toHaveBeenCalled();
	});
	
	test('popupSignOutCallback', () => {
		const popupSignOutCallbackSpy = jest.spyOn(window.authentication, 'popupSignOutCallback').mockImplementation();
		void webAuth.popupSignOutCallback();
		expect(popupSignOutCallbackSpy).toHaveBeenCalled();
	});

});

// User Service
describe('User service functions', () => {
	test('getUserProfile', () => {
		const getUserProfileSpy = jest.spyOn(UserService, 'getUserProfile').mockImplementation();
		const options = {
			access_token: ''
		}
		void webAuth.getUserProfile(options);
		expect(getUserProfileSpy).toHaveBeenCalledWith(options);
	});
	
	test('register', () => {
		const registerSpy = jest.spyOn(UserService, 'register').mockImplementation();
		const options: UserEntity = {
			given_name: '',
			family_name: '',
			email: '',
			password: '',
			password_echo: ''
		};
		const headers = {
			requestId: ''
		}
		void webAuth.register(options, headers);
		expect(registerSpy).toHaveBeenCalledWith(options, headers);
	});
	
	test('getInviteUserDetails to call with callLatestApi parameter', () => {
		const getInviteUserDetailsSpy = jest.spyOn(UserService, 'getInviteUserDetails').mockImplementation();
		const options = {
			invite_id: '',
			callLatestAPI: true
		};
		void webAuth.getInviteUserDetails(options);
		expect(getInviteUserDetailsSpy).toHaveBeenCalledWith(options);
	});

	test('getInviteUserDetails to call without callLatestApi parameter', () => {
		const getInviteUserDetailsSpy = jest.spyOn(UserService, 'getInviteUserDetails').mockImplementation();
		const options = {
			invite_id: '',
		};
		void webAuth.getInviteUserDetails(options);
		expect(getInviteUserDetailsSpy).toHaveBeenCalledWith(options);
	});
	
	test('getCommunicationStatus', () => {
		const getCommunicationStatusSpy = jest.spyOn(UserService, 'getCommunicationStatus').mockImplementation();
		const options = {
			sub: ''
		};
		const headers = {
			requestId: ''
		}
		void webAuth.getCommunicationStatus(options, headers);
		expect(getCommunicationStatusSpy).toHaveBeenCalledWith(options, headers);
	});
	
	test('initiateResetPassword', () => {
		const initiateResetPasswordSpy = jest.spyOn(UserService, 'initiateResetPassword').mockImplementation();
		const options: ResetPasswordEntity = {
			email: '',
			resetMedium: 'SMS',
			processingType: 'CODE',
			requestId: ''
		};
		void webAuth.initiateResetPassword(options);
		expect(initiateResetPasswordSpy).toHaveBeenCalledWith(options);
	});
	
	test('handleResetPassword', () => {
		const handleResetPasswordSpy = jest.spyOn(UserService, 'handleResetPassword').mockImplementation();
		const options: ValidateResetPasswordEntity = {
			resetRequestId: '',
			code: ''
		};
		void webAuth.handleResetPassword(options);
		expect(handleResetPasswordSpy).toHaveBeenCalledWith(options);
	});
	
	test('resetPassword', () => {
		const resetPasswordSpy = jest.spyOn(UserService, 'resetPassword').mockImplementation();
		const options: AcceptResetPasswordEntity = {
			resetRequestId: '',
			exchangeId: '',
			password: '',
			confirmPassword: ''
		};
		void webAuth.resetPassword(options);
		expect(resetPasswordSpy).toHaveBeenCalledWith(options);
	});

	test('getDeduplicationDetails', () => {
		const getDeduplicationDetailsSpy = jest.spyOn(UserService, 'getDeduplicationDetails').mockImplementation();
		const options = {
			trackId: ''
		};
		void webAuth.getDeduplicationDetails(options);
		expect(getDeduplicationDetailsSpy).toHaveBeenCalledWith(options);
	});

	test('deduplicationLogin', () => {
		const deduplicationLoginSpy = jest.spyOn(UserService, 'deduplicationLogin').mockImplementation();
		const options = {
			trackId: '',
			requestId: '',
			sub: ''
		};
		webAuth.deduplicationLogin(options);
		expect(deduplicationLoginSpy).toHaveBeenCalledWith(options);
	});

	test('registerDeduplication', () => {
		const registerDeduplicationSpy = jest.spyOn(UserService, 'registerDeduplication').mockImplementation();
		const options = {
			trackId: ''
		};
		void webAuth.registerDeduplication(options);
		expect(registerDeduplicationSpy).toHaveBeenCalledWith(options);
	});

	test('changePassword', () => {
		const changePasswordSpy = jest.spyOn(UserService, 'changePassword').mockImplementation();
		const options: ChangePasswordEntity = {
			sub: '',
			identityId: '',
			old_password: '',
			new_password: '',
			confirm_password: '',
		};
		const accessToken = '';
		void webAuth.changePassword(options, accessToken);
		expect(changePasswordSpy).toHaveBeenCalledWith(options, accessToken);
	});

	test('updateProfile', () => {
		const updateProfileSpy = jest.spyOn(UserService, 'updateProfile').mockImplementation();
		const options: UserEntity = {
			given_name: '',
			family_name: '',
			email: '',
			password: '',
			password_echo: ''
		};
		const accessToken = '';
		const sub = '';
		void webAuth.updateProfile(options, accessToken, sub);
		expect(updateProfileSpy).toHaveBeenCalledWith(options, accessToken, sub);
	});

	test('initiateLinkAccount', () => {
		const initiateLinkAccountSpy = jest.spyOn(UserService, 'initiateLinkAccount').mockImplementation();
		const options: IUserLinkEntity = {
			master_sub: '',
			user_name_type: '',
			user_name_to_link: '',
			link_accepted_by: '',
			link_response_time: mockDate,
			link_accepted: false,
			communication_type: '',
			verification_status_id: '',
			type: '',
			status: ''
		};
		const accessToken = '';
		void webAuth.initiateLinkAccount(options, accessToken);
		expect(initiateLinkAccountSpy).toHaveBeenCalledWith(options, accessToken);
	});

	test('completeLinkAccount', () => {
		const completeLinkAccountSpy = jest.spyOn(UserService, 'completeLinkAccount').mockImplementation();
		const options = {};
		const accessToken = '';
		void webAuth.completeLinkAccount(options, accessToken);
		expect(completeLinkAccountSpy).toHaveBeenCalledWith(options, accessToken);
	});

	test('getLinkedUsers', () => {
		const getLinkedUsersSpy = jest.spyOn(UserService, 'getLinkedUsers').mockImplementation();
		const accessToken = '';
		const sub = '';
		void webAuth.getLinkedUsers(accessToken, sub);
		expect(getLinkedUsersSpy).toHaveBeenCalledWith(accessToken, sub);
	});

	test('unlinkAccount', () => {
		const unlinkAccountSpy = jest.spyOn(UserService, 'unlinkAccount').mockImplementation();
		const accessToken = '';
		const identityId = '';
		void webAuth.unlinkAccount(accessToken, identityId);
		expect(unlinkAccountSpy).toHaveBeenCalledWith(accessToken, identityId);
	});

	test('deleteUserAccount', () => {
		const deleteUserAccountSpy = jest.spyOn(UserService, 'deleteUserAccount').mockImplementation();
		const options = {
			access_token: '',
			sub: ''
		};
		void webAuth.deleteUserAccount(options);
		expect(deleteUserAccountSpy).toHaveBeenCalledWith(options);
	});

	test('userCheckExists', () => {
		const userCheckExistsSpy = jest.spyOn(UserService, 'userCheckExists').mockImplementation();
		const options: FindUserEntity = {
			sub: '',
			email: '',
			mobile: '',
			username: '',
			customFields: undefined,
			provider: '',
			providerUserId: '',
			rememberMe: '',
			webfinger: '',
			sub_not: '',
			requestId: ''
		};
		void webAuth.userCheckExists(options);
		expect(userCheckExistsSpy).toHaveBeenCalledWith(options);
	});

});

// Token Service
describe('Token service functions', () => {
	test('renewToken', () => {
		const renewTokenSpy = jest.spyOn(TokenService, 'renewToken').mockImplementation();
		const options: AccessTokenRequest = {
			user_agent: '',
			ip_address: '',
			accept_language: '',
			lat: '',
			lng: '',
			finger_print: '',
			referrer: '',
			pre_login_id: '',
			login_type: '',
			device_code: ''
		}
		void webAuth.renewToken(options);
		expect(renewTokenSpy).toHaveBeenCalledWith(options);
	});
	
	test('getAccessToken', () => {
		const getAccessTokenSpy = jest.spyOn(TokenService, 'getAccessToken').mockImplementation();
		const options: AccessTokenRequest = {
			user_agent: '',
			ip_address: '',
			accept_language: '',
			lat: '',
			lng: '',
			finger_print: '',
			referrer: '',
			pre_login_id: '',
			login_type: '',
			device_code: ''
		}
		void webAuth.getAccessToken(options);
		expect(getAccessTokenSpy).toHaveBeenCalledWith(options);
	});
	
	test('validateAccessToken', () => {
		const validateAccessTokenSpy = jest.spyOn(TokenService, 'validateAccessToken').mockImplementation();
		const options: TokenIntrospectionEntity = {
			token: '',
			strictGroupValidation: false,
			strictScopeValidation: false,
			strictRoleValidation: false,
			strictValidation: false
		}
		void webAuth.validateAccessToken(options);
		expect(validateAccessTokenSpy).toHaveBeenCalledWith(options);
	});
	
	test('loginPrecheck', () => {
		const loginPrecheckSpy = jest.spyOn(TokenService, 'loginPrecheck').mockImplementation();
		const options = {
			track_id: '',
			locale: ''
		};
		void webAuth.loginPrecheck(options);
		expect(loginPrecheckSpy).toHaveBeenCalledWith(options);
	});

	test('getMissingFieldsFromDefaultProvider', () => {
		const getMissingFieldsSpy = jest.spyOn(TokenService, 'getMissingFields').mockImplementation();
		const	trackId = '';
		void webAuth.getMissingFields(trackId);
		expect(getMissingFieldsSpy).toHaveBeenCalledWith(trackId);
	});

	test('getMissingFieldsFromSocialProvider', async() => {
		const trackId = '';
		const useSocialProvider = {requestId: ''};
		console.log("oidc setting: " + authority);
		const serviceURL = `${authority}/public-srv/public/trackinfo/${useSocialProvider.requestId}/${trackId}`;
		void webAuth.getMissingFields(trackId, useSocialProvider);
		expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL,false, "GET");
	});

	test('initiateDeviceCode', () => {
		const initiateDeviceCodeSpy = jest.spyOn(TokenService, 'initiateDeviceCode').mockImplementation();
		const	clientId = '';
		void webAuth.initiateDeviceCode(clientId);
		expect(initiateDeviceCodeSpy).toHaveBeenCalledWith(clientId);
	});

	test('deviceCodeVerify', () => {
		const deviceCodeVerifySpy = jest.spyOn(TokenService, 'deviceCodeVerify').mockImplementation();
		const	code = '';
		webAuth.deviceCodeVerify(code);
		expect(deviceCodeVerifySpy).toHaveBeenCalledWith(code);
	});

	test('offlineTokenCheck', () => {
		const offlineTokenCheckSpy = jest.spyOn(TokenService, 'offlineTokenCheck').mockImplementation();
		const	accessToken = '';
		webAuth.offlineTokenCheck(accessToken);
		expect(offlineTokenCheckSpy).toHaveBeenCalledWith(accessToken);
	});

});

// Login Service
describe('Login service functions', () => {
	test('loginWithCredentials', () => {
		const loginWithCredentialsSpy = jest.spyOn(LoginService, 'loginWithCredentials').mockImplementation();
		const options: LoginFormRequestEntity = {
			username: '',
			password: '',
			requestId: ''
		}
		webAuth.loginWithCredentials(options);
		expect(loginWithCredentialsSpy).toHaveBeenCalledWith(options);
	});
	
	test('loginWithSocial', () => {
		const loginWithSocialSpy = jest.spyOn(LoginService, 'loginWithSocial').mockImplementation();
		const options = {
			provider: '',
			requestId: ''
		}
		const queryParams = {
			dc: '',
			device_fp: ''
		}
		webAuth.loginWithSocial(options, queryParams);
		expect(loginWithSocialSpy).toHaveBeenCalledWith(options, queryParams);
	});
	
	test('registerWithSocial', () => {
		const registerWithSocialSpy = jest.spyOn(LoginService, 'registerWithSocial').mockImplementation();
		const options = {
			provider: '',
			requestId: ''
		}
		const queryParams = {
			dc: '',
			device_fp: ''
		}
		webAuth.registerWithSocial(options, queryParams);
		expect(registerWithSocialSpy).toHaveBeenCalledWith(options, queryParams);
	});
	
	test('passwordlessLogin', () => {
		const passwordlessLoginSpy = jest.spyOn(LoginService, 'passwordlessLogin').mockImplementation();
		const options: PhysicalVerificationLoginRequest = {};
		webAuth.passwordlessLogin(options);
		expect(passwordlessLoginSpy).toHaveBeenCalledWith(options);
	});

	test('consentContinue', () => {
		const consentContinueSpy = jest.spyOn(LoginService, 'consentContinue').mockImplementation();
		const options = {
			track_id: ''
		};
		webAuth.consentContinue(options);
		expect(consentContinueSpy).toHaveBeenCalledWith(options);
	});

	test('mfaContinue', () => {
		const mfaContinueSpy = jest.spyOn(LoginService, 'mfaContinue').mockImplementation();
		const options = {
			track_id: ''
		};
		webAuth.mfaContinue(options);
		expect(mfaContinueSpy).toHaveBeenCalledWith(options);
	});

	test('firstTimeChangePassword', () => {
		const firstTimeChangePasswordSpy = jest.spyOn(LoginService, 'firstTimeChangePassword').mockImplementation();
		const options: IChangePasswordEntity = {
			old_password: '',
			new_password: '',
			confirm_password: '',
			loginSettingsId: ''
		};
		webAuth.firstTimeChangePassword(options);
		expect(firstTimeChangePasswordSpy).toHaveBeenCalledWith(options);
	});

	test('progressiveRegistration', () => {
		const progressiveRegistrationSpy = jest.spyOn(LoginService, 'progressiveRegistration').mockImplementation();
		const options: IUserEntity = {
			userStatus: '',
			user_status: '',
			user_status_reason: '',
			username: '',
			sub: '',
			given_name: '',
			family_name: '',
			middle_name: '',
			nickname: '',
			email: '',
			email_verified: false,
			mobile_number: '',
			mobile_number_obj: null,
			mobile_number_verified: false,
			phone_number: '',
			phone_number_obj: null,
			phone_number_verified: false,
			profile: '',
			picture: '',
			website: '',
			gender: '',
			zoneinfo: '',
			locale: '',
			birthdate: null,
			password: '',
			provider: '',
			providerUserId: '',
			identityId: '',
			roles: [],
			userGroups: [],
			rawJSON: '',
			trackId: '',
			need_reset_password: false
		};
		const headers = {
			requestId: '',
			trackId: '',
			acceptlanguage: ''
		}
		void webAuth.progressiveRegistration(options, headers);
		expect(progressiveRegistrationSpy).toHaveBeenCalledWith(options, headers);
	});

});

// Verification Service
describe('Verification service functions', () => {
	test('initiateAccountVerification', () => {
		const initiateAccountVerificationSpy = jest.spyOn(VerificationService, 'initiateAccountVerification').mockImplementation();
		const options: AccountVerificationRequestEntity = {
			sub: ''
		};
		webAuth.initiateAccountVerification(options);
		expect(initiateAccountVerificationSpy).toHaveBeenCalledWith(options);
	});
	
	test('verifyAccount', () => {
		const verifyAccountSpy = jest.spyOn(VerificationService, 'verifyAccount').mockImplementation();
		const options = {
			accvid: '',
			code: ''
		};
		void webAuth.verifyAccount(options);
		expect(verifyAccountSpy).toHaveBeenCalledWith(options);
	});
	
	test('getMFAList', () => {
		const getMFAListSpy = jest.spyOn(VerificationService, 'getMFAList').mockImplementation();
		const options: IConfiguredListRequestEntity = {
			sub: '',
			email: '',
			mobile_number: '',
			username: '',
			request_id: '',
			verification_types: [],
			single_factor_sub_ref: '',
			device_fp: '',
			provider: '',
			device_id: '',
			verification_type: ''
		};
		void webAuth.getMFAList(options);
		expect(getMFAListSpy).toHaveBeenCalledWith(options);
	});
	
	test('cancelMFA', () => {
		const cancelMFASpy = jest.spyOn(VerificationService, 'cancelMFA').mockImplementation();
		const options = {
			exchange_id: '',
			reason: '',
			type: ''
		};
		void webAuth.cancelMFA(options);
		expect(cancelMFASpy).toHaveBeenCalledWith(options);
	});

	test('getAllVerificationList', () => {
		const getAllVerificationListSpy = jest.spyOn(VerificationService, 'getAllVerificationList').mockImplementation();
		const accessToken = '';
		void webAuth.getAllVerificationList(accessToken);
		expect(getAllVerificationListSpy).toHaveBeenCalledWith(accessToken);
	});

	test('initiateEnrollment', () => {
		const initiateEnrollmentSpy = jest.spyOn(VerificationService, 'initiateEnrollment').mockImplementation();
		const options = {
			verification_type: ''
		};
		const accessToken = '';
		void webAuth.initiateEnrollment(options, accessToken);
		expect(initiateEnrollmentSpy).toHaveBeenCalledWith(options, accessToken);
	});

	test('getEnrollmentStatus', () => {
		const getEnrollmentStatusSpy = jest.spyOn(VerificationService, 'getEnrollmentStatus').mockImplementation();
		const statusId = '';
		const accessToken = '';
		void webAuth.getEnrollmentStatus(statusId, accessToken);
		expect(getEnrollmentStatusSpy).toHaveBeenCalledWith(statusId, accessToken);
	});

	test('enrollVerification', () => {
		const enrollVerificationSpy = jest.spyOn(VerificationService, 'enrollVerification').mockImplementation();
		const options: IEnrollVerificationSetupRequestEntity = {
			exchange_id: '',
			device_id: '',
			finger_print: '',
			client_id: '',
			push_id: '',
			pass_code: '',
			pkce_key: '',
			face_attempt: 0,
			attempt: 0,
			fido2_client_response: {} ,
			verification_type: ''
		};
		void webAuth.enrollVerification(options);
		expect(enrollVerificationSpy).toHaveBeenCalledWith(options);
	});

	test('checkVerificationTypeConfigured', () => {
		const checkVerificationTypeConfiguredSpy = jest.spyOn(VerificationService, 'checkVerificationTypeConfigured').mockImplementation();
		const options: IConfiguredListRequestEntity = {
			sub: '',
			email: '',
			mobile_number: '',
			username: '',
			request_id: '',
			verification_types: [],
			single_factor_sub_ref: '',
			device_fp: '',
			provider: '',
			device_id: '',
			verification_type: ''
		};
		void webAuth.checkVerificationTypeConfigured(options);
		expect(checkVerificationTypeConfiguredSpy).toHaveBeenCalledWith(options);
	});

	test('initiateMFA', () => {
		const initiateMFASpy = jest.spyOn(VerificationService, 'initiateMFA').mockImplementation();
		const options: IInitVerificationAuthenticationRequestEntity = {
			usage_type: '',
			processingType: '',
			request_id: ''
		};
		void webAuth.initiateMFA(options);
		expect(initiateMFASpy).toHaveBeenCalledWith(options);
	});

	test('initiateMFA with access token', () => {
		const initiateMFASpy = jest.spyOn(VerificationService, 'initiateMFA').mockImplementation();
		const options: IInitVerificationAuthenticationRequestEntity = {
			usage_type: '',
			processingType: '',
			request_id: ''
		};
		const accessToken = 'accessToken';
		void webAuth.initiateMFA(options, accessToken);
		expect(initiateMFASpy).toHaveBeenCalledWith(options, accessToken);
	});

	test('authenticateMFA', () => {
		const authenticateMFASpy = jest.spyOn(VerificationService, 'authenticateMFA').mockImplementation();
		const options: IAuthVerificationAuthenticationRequestEntity = {
			type: '',
			exchange_id: '',
			client_id: ''
		};
		void webAuth.authenticateMFA(options);
		expect(authenticateMFASpy).toHaveBeenCalledWith(options);
	});

});

// Consent Service
describe('Consent service functions', () => {
	test('getConsentDetails', () => {
		const getConsentDetailsSpy = jest.spyOn(ConsentService, 'getConsentDetails').mockImplementation();
		const options = {
			consent_id: '',
			consent_version_id: '',
			sub: ''
		};
		void webAuth.getConsentDetails(options);
		expect(getConsentDetailsSpy).toHaveBeenCalledWith(options);
	});
	
	test('acceptConsent', () => {
		const acceptConsentSpy = jest.spyOn(ConsentService, 'acceptConsent').mockImplementation();
		const options: IConsentAcceptEntity = {
			client_id: '',
			consent_id: '',
			consent_version_id: '',
			sub: '',
			scopes: [],
			url: '',
			matcher: undefined,
			field_key: '',
			accepted_fields: [],
			accepted_by: '',
			skipped: false,
			action_type: '',
			action_id: '',
			q: '',
			revoked: false
		};
		void webAuth.acceptConsent(options);
		expect(acceptConsentSpy).toHaveBeenCalledWith(options);
	});
	
	test('getConsentVersionDetails', () => {
		const getConsentVersionDetailsSpy = jest.spyOn(ConsentService, 'getConsentVersionDetails').mockImplementation();
		const options = {
			consentid: '',
			locale: '',
			access_token: ''
		};
		void webAuth.getConsentVersionDetails(options);
		expect(getConsentVersionDetailsSpy).toHaveBeenCalledWith(options);
	});
	
	test('acceptScopeConsent', () => {
		const acceptScopeConsentSpy = jest.spyOn(ConsentService, 'acceptScopeConsent').mockImplementation();
		const options = {
			client_id: '',
			sub: '',
			scopes: ['']
		};
		void webAuth.acceptScopeConsent(options);
		expect(acceptScopeConsentSpy).toHaveBeenCalledWith(options);
	});
	
	test('acceptClaimConsent', () => {
		const acceptClaimConsentSpy = jest.spyOn(ConsentService, 'acceptClaimConsent').mockImplementation();
		const options = {
			client_id: '',
			sub: '',
			accepted_claims: ['']
		};
		void webAuth.acceptClaimConsent(options);
		expect(acceptClaimConsentSpy).toHaveBeenCalledWith(options);
	});
	
	test('revokeClaimConsent', () => {
		const revokeClaimConsentSpy = jest.spyOn(ConsentService, 'revokeClaimConsent').mockImplementation();
		const options = {
			client_id: '',
			sub: '',
			revoked_claims: ['']
		};
		void webAuth.revokeClaimConsent(options);
		expect(revokeClaimConsentSpy).toHaveBeenCalledWith(options);
	});

});
