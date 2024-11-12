import { WebAuth } from './WebAuth';
import { GetAccessTokenRequest, RenewTokenRequest, TokenIntrospectionRequest } from '../token-service/TokenService.model';
import * as ConsentService from '../consent-service/ConsentService';
import { Helper } from '../common/Helper';
import * as LoginService from '../login-service/LoginService';
import * as TokenService from '../token-service/TokenService';
import * as UserService from '../user-service/UserService';
import * as VerificationService from '../verification-service/VerificationService';
import { SigninRequest } from 'oidc-client-ts';
import { AcceptClaimConsentRequest, AcceptConsentRequest, AcceptScopeConsentRequest, GetConsentVersionDetailsRequest, RevokeClaimConsentRequest } from '../consent-service/ConsentService.model';
import { FirstTimeChangePasswordRequest, LoginAfterRegisterRequest, LoginWithCredentialsRequest, MfaContinueRequest, PasswordlessLoginRequest, ProgressiveRegistrationHeader, SocialProviderPathParameter, SocialProviderQueryParameter } from '../login-service/LoginService.model';
import { LoginPrecheckRequest, ProcessingType, VerificationType } from '../common/Common.model';
import { CidaasUser } from '../common/User.model';
import { ChangePasswordRequest, CompleteLinkAccountRequest, DeleteUserAccountRequest, HandleResetPasswordRequest, InitiateLinkAccountRequest, InitiateResetPasswordRequest, RegisterRequest, ResetMedium, ResetPasswordRequest, UserCheckExistsRequest } from '../user-service/UserService.model';
import { AuthenticateMFARequest, CancelMFARequest, CheckVerificationTypeConfiguredRequest, ConfigureFriendlyNameRequest, ConfigureVerificationRequest, EnrollVerificationRequest, GetMFAListRequest, InitiateAccountVerificationRequest, InitiateEnrollmentRequest, InitiateMFARequest, InitiateVerificationRequest, VerifyAccountRequest } from '../verification-service/VerificationService.model';
import { DeleteDeviceRequest, GetRegistrationSetupRequest, GetUserActivitiesRequest, UpdateProfileImageRequest, UserActionOnEnrollmentRequest } from './webauth.model';

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
		webAuth.getUserInfo();
		expect(getUserSpy).toHaveBeenCalled();
	});
	
	test('getLoginURL', () => {
		const createSigninRequestSpy = jest.spyOn(window.usermanager.getClient(), 'createSigninRequest').mockResolvedValue({ url: 'empty' } as SigninRequest);
		webAuth.getLoginURL();
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
		webAuth.getRequestId();
		jest.useRealTimers();
		expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST');
	});
	
	test('getTenantInfo', () => {
		const serviceURL = `${authority}/public-srv/tenantinfo/basic`;
		webAuth.getTenantInfo();
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
		webAuth.getClientInfo(options);
		expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET');
	});
	
	test('getDevicesInfo', () => {
		const acccessToken = 'accessToken';
		const serviceURL = `${authority}/device-srv/devices`;
		webAuth.getDevicesInfo(undefined, acccessToken);
		expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET', acccessToken);
	});
	
	test('deleteDevice', () => {
		const options: DeleteDeviceRequest = {
			device_id: 'device_id'
		};
		const acccessToken = 'accessToken';
		const serviceURL = `${authority}/device-srv/device/${options.device_id}`;
		webAuth.deleteDevice(options, acccessToken);
		expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'DELETE', acccessToken);
	});
	
	test('getRegistrationSetup', () => {
		const options: GetRegistrationSetupRequest = {
			acceptlanguage: 'acceptlanguage',
			requestId: 'requestId'
		};
		const serviceURL = `${authority}/registration-setup-srv/public/list?acceptlanguage=${options.acceptlanguage}&requestId=${options.requestId}`;
		webAuth.getRegistrationSetup(options);
		expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET');
	});
	
	test('createDeviceInfo', () => {
		const options = {
			userAgent: window.navigator.userAgent
		};
		const serviceURL = `${authority}/device-srv/deviceinfo`;
		webAuth.createDeviceInfo();
		expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST');
	});

	test('getUserActivities', () => {
		const options: GetUserActivitiesRequest = {
			sub: '',
			dateFilter: {
				from_date: '',
				to_date: ''
			}
		};
		const accessToken = '';
		const serviceURL = `${authority}/activity-streams-srv/user-activities`;
		webAuth.getUserActivities(options, accessToken);
		expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST', accessToken);
	});
	
	test('updateProfileImage', () => {
		const options: UpdateProfileImageRequest = {
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
	
		webAuth.updateProfileImage(options, accessToken);
		expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, 'POST', accessToken, null, formdata);
	});

	test('userActionOnEnrollment', () => {
		const options: UserActionOnEnrollmentRequest = {
			action: 'action'
		};
		const trackId = 'trackId';
		const serviceURL = `${authority}/auth-actions-srv/validation/${trackId}`;
		webAuth.userActionOnEnrollment(options, trackId);
		expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST');
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
		webAuth.loginWithBrowser();
		expect(loginOrRegisterWithBrowserSpy).toHaveBeenCalledWith('login', undefined);
	});
	
	test('popupSignIn', () => {
		const popupSignInSpy = jest.spyOn(window.authentication, 'popupSignIn').mockImplementation();
		webAuth.popupSignIn();
		expect(popupSignInSpy).toHaveBeenCalled();
	});
	
	test('silentSignIn', () => {
		const silentSignInSpy = jest.spyOn(window.authentication, 'silentSignIn').mockResolvedValue(null);
		webAuth.silentSignIn();
		expect(silentSignInSpy).toHaveBeenCalled();
	});
	
	test('registerWithBrowser', () => {
		const loginOrRegisterWithBrowserSpy = jest.spyOn(window.authentication, 'loginOrRegisterWithBrowser').mockResolvedValue(null);
		webAuth.registerWithBrowser();
		expect(loginOrRegisterWithBrowserSpy).toHaveBeenCalledWith('register', undefined);
	});
	
	test('loginCallback', () => {
		const loginCallbackSpy = jest.spyOn(window.authentication, 'loginCallback').mockResolvedValue(null);
		webAuth.loginCallback();
		expect(loginCallbackSpy).toHaveBeenCalled();
	});
	
	test('popupSignInCallback', () => {
		const popupSignInCallbackSpy = jest.spyOn(window.authentication, 'popupSignInCallback').mockResolvedValue(null);
		webAuth.popupSignInCallback();
		expect(popupSignInCallbackSpy).toHaveBeenCalled();
	});
	
	test('silentSignInCallback', () => {
		const silentSignInCallbackSpy = jest.spyOn(window.authentication, 'silentSignInCallback').mockResolvedValue(null);
		webAuth.silentSignInCallback();
		expect(silentSignInCallbackSpy).toHaveBeenCalled();
	});
	
	test('logout', () => {
		const logoutSpy = jest.spyOn(window.authentication, 'logout').mockResolvedValue(null);
		webAuth.logout();
		expect(logoutSpy).toHaveBeenCalled();
	});
	
	test('popupSignOut', () => {
		const popupSignOutSpy = jest.spyOn(window.authentication, 'popupSignOut').mockImplementation();
		webAuth.popupSignOut();
		expect(popupSignOutSpy).toHaveBeenCalled();
	});
	
	test('logoutCallback', () => {
		const logoutCallbackSpy = jest.spyOn(window.authentication, 'logoutCallback').mockResolvedValue(null);
		webAuth.logoutCallback();
		expect(logoutCallbackSpy).toHaveBeenCalled();
	});
	
	test('popupSignOutCallback', () => {
		const popupSignOutCallbackSpy = jest.spyOn(window.authentication, 'popupSignOutCallback').mockImplementation();
		webAuth.popupSignOutCallback();
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
		webAuth.getUserProfile(options);
		expect(getUserProfileSpy).toHaveBeenCalledWith(options);
	});
	
	test('register', () => {
		const registerSpy = jest.spyOn(UserService, 'register').mockImplementation();
		const options: RegisterRequest = {
			given_name: '',
			family_name: '',
			email: '',
			password: '',
			password_echo: ''
		};
		const headers = {
			requestId: ''
		}
		webAuth.register(options, headers);
		expect(registerSpy).toHaveBeenCalledWith(options, headers);
	});
	
	test('getInviteUserDetails to call with callLatestApi parameter', () => {
		const getInviteUserDetailsSpy = jest.spyOn(UserService, 'getInviteUserDetails').mockImplementation();
		const options = {
			invite_id: '',
			callLatestAPI: true
		};
		webAuth.getInviteUserDetails(options);
		expect(getInviteUserDetailsSpy).toHaveBeenCalledWith(options, undefined);
	});

	test('getInviteUserDetails to call without callLatestApi parameter', () => {
		const getInviteUserDetailsSpy = jest.spyOn(UserService, 'getInviteUserDetails').mockImplementation();
		const options = {
			invite_id: '',
		};
		webAuth.getInviteUserDetails(options);
		expect(getInviteUserDetailsSpy).toHaveBeenCalledWith(options, undefined);
	});
	
	test('getCommunicationStatus', () => {
		const getCommunicationStatusSpy = jest.spyOn(UserService, 'getCommunicationStatus').mockImplementation();
		const options = {
			sub: ''
		};
		const headers = {
			requestId: ''
		}
		webAuth.getCommunicationStatus(options, headers);
		expect(getCommunicationStatusSpy).toHaveBeenCalledWith(options, headers);
	});
	
	test('initiateResetPassword', () => {
		const initiateResetPasswordSpy = jest.spyOn(UserService, 'initiateResetPassword').mockImplementation();
		const options: InitiateResetPasswordRequest = {
			email: '',
			resetMedium: ResetMedium.SMS,
			processingType: ProcessingType.CODE,
			requestId: ''
		};
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.initiateResetPassword(options, headers);
		expect(initiateResetPasswordSpy).toHaveBeenCalledWith(options, headers);
	});
	
	test('handleResetPassword', () => {
		const handleResetPasswordSpy = jest.spyOn(UserService, 'handleResetPassword').mockImplementation();
		const options: HandleResetPasswordRequest = {
			resetRequestId: '',
			code: ''
		};
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.handleResetPassword(options, false, headers);
		expect(handleResetPasswordSpy).toHaveBeenCalledWith(options, false, headers);
	});
	
	test('resetPassword', () => {
		const resetPasswordSpy = jest.spyOn(UserService, 'resetPassword').mockImplementation();
		const options: ResetPasswordRequest = {
			resetRequestId: '',
			exchangeId: '',
			password: '',
			confirmPassword: ''
		};
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.resetPassword(options, false, headers);
		expect(resetPasswordSpy).toHaveBeenCalledWith(options, false, headers);
	});

	test('getDeduplicationDetails', () => {
		const getDeduplicationDetailsSpy = jest.spyOn(UserService, 'getDeduplicationDetails').mockImplementation();
		const options = {
			trackId: ''
		};
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.getDeduplicationDetails(options, headers);
		expect(getDeduplicationDetailsSpy).toHaveBeenCalledWith(options, headers);
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
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.registerDeduplication(options, headers);
		expect(registerDeduplicationSpy).toHaveBeenCalledWith(options, headers);
	});

	test('changePassword', () => {
		const changePasswordSpy = jest.spyOn(UserService, 'changePassword').mockImplementation();
		const options: ChangePasswordRequest = {
			sub: '',
			identityId: '',
			old_password: '',
			new_password: '',
			confirm_password: '',
		};
		const accessToken = '';
		webAuth.changePassword(options, accessToken);
		expect(changePasswordSpy).toHaveBeenCalledWith(options, accessToken);
	});

	test('updateProfile', () => {
		const updateProfileSpy = jest.spyOn(UserService, 'updateProfile').mockImplementation();
		const options: CidaasUser = {
			given_name: '',
			family_name: '',
			email: '',
			password: '',
			password_echo: ''
		};
		const accessToken = '';
		const sub = '';
		webAuth.updateProfile(options, accessToken, sub);
		expect(updateProfileSpy).toHaveBeenCalledWith(options, accessToken, sub);
	});

	test('initiateLinkAccount', () => {
		const initiateLinkAccountSpy = jest.spyOn(UserService, 'initiateLinkAccount').mockImplementation();
		const options: InitiateLinkAccountRequest = {
			master_sub: '',
			user_name_type: '',
			user_name_to_link: ''
		};
		const accessToken = '';
		webAuth.initiateLinkAccount(options, accessToken);
		expect(initiateLinkAccountSpy).toHaveBeenCalledWith(options, accessToken);
	});

	test('completeLinkAccount', () => {
		const completeLinkAccountSpy = jest.spyOn(UserService, 'completeLinkAccount').mockImplementation();
		const options: CompleteLinkAccountRequest = {};
		const accessToken = '';
		webAuth.completeLinkAccount(options, accessToken);
		expect(completeLinkAccountSpy).toHaveBeenCalledWith(options, accessToken);
	});

	test('getLinkedUsers', () => {
		const getLinkedUsersSpy = jest.spyOn(UserService, 'getLinkedUsers').mockImplementation();
		const accessToken = '';
		const sub = '';
		webAuth.getLinkedUsers(accessToken, sub);
		expect(getLinkedUsersSpy).toHaveBeenCalledWith(accessToken, sub);
	});

	test('unlinkAccount', () => {
		const unlinkAccountSpy = jest.spyOn(UserService, 'unlinkAccount').mockImplementation();
		const accessToken = '';
		const identityId = '';
		webAuth.unlinkAccount(accessToken, identityId);
		expect(unlinkAccountSpy).toHaveBeenCalledWith(accessToken, identityId);
	});

	test('deleteUserAccount', () => {
		const deleteUserAccountSpy = jest.spyOn(UserService, 'deleteUserAccount').mockImplementation();
		const options: DeleteUserAccountRequest = {
			access_token: '',
			sub: ''
		};
		webAuth.deleteUserAccount(options);
		expect(deleteUserAccountSpy).toHaveBeenCalledWith(options);
	});

	test('userCheckExists', () => {
		const userCheckExistsSpy = jest.spyOn(UserService, 'userCheckExists').mockImplementation();
		const options: UserCheckExistsRequest = {
			email: '',
			mobile: '',
			username: '',
			rememberMe: '',
			webfinger: '',
			requestId: ''
		};
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.userCheckExists(options, headers);
		expect(userCheckExistsSpy).toHaveBeenCalledWith(options, headers);
	});

});

// Token Service
describe('Token service functions', () => {
	test('renewToken', () => {
		const renewTokenSpy = jest.spyOn(TokenService, 'renewToken').mockImplementation();
		const options: RenewTokenRequest = {
			client_id: '',
			grant_type: '',
			refresh_token: ''
		}
		webAuth.renewToken(options);
		expect(renewTokenSpy).toHaveBeenCalledWith(options);
	});
	
	test('getAccessToken', () => {
		const getAccessTokenSpy = jest.spyOn(TokenService, 'getAccessToken').mockImplementation();
		const options: GetAccessTokenRequest = {
			code: '',
			code_verifier: '',
			client_id: '',
			grant_type: '',
			redirect_uri: ''
		}
		webAuth.getAccessToken(options);
		expect(getAccessTokenSpy).toHaveBeenCalledWith(options);
	});
	
	test('validateAccessToken', () => {
		const validateAccessTokenSpy = jest.spyOn(TokenService, 'validateAccessToken').mockImplementation();
		const options: TokenIntrospectionRequest = {
			token: '',
			strictGroupValidation: false,
			strictScopeValidation: false,
			strictRoleValidation: false,
			strictValidation: false
		}
		webAuth.validateAccessToken(options);
		expect(validateAccessTokenSpy).toHaveBeenCalledWith(options);
	});
	
	test('loginPrecheck', () => {
		const loginPrecheckSpy = jest.spyOn(TokenService, 'loginPrecheck').mockImplementation();
		const options = {
			track_id: ''
		};
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.loginPrecheck(options, headers);
		expect(loginPrecheckSpy).toHaveBeenCalledWith(options, headers);
	});

	test('getMissingFieldsFromDefaultProvider', () => {
		const getMissingFieldsSpy = jest.spyOn(TokenService, 'getMissingFields').mockImplementation();
		const trackId = '';
		webAuth.getMissingFields(trackId);
		expect(getMissingFieldsSpy).toHaveBeenCalledWith(trackId, undefined);
	});
	
	test('getMissingFieldsFromDefaultProvider with lat lon headers', () => {
		const getMissingFieldsSpy = jest.spyOn(TokenService, 'getMissingFields').mockImplementation();
		const trackId = '';
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.getMissingFields(trackId, undefined, headers);
		expect(getMissingFieldsSpy).toHaveBeenCalledWith(trackId, headers);
	});

	test('getMissingFieldsFromSocialProvider', () => {
		const trackId = '';
		const useSocialProvider = {requestId: ''};
		const serviceURL = `${authority}/public-srv/public/trackinfo/${useSocialProvider.requestId}/${trackId}`;
		webAuth.getMissingFields(trackId, useSocialProvider);
		expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL,false, "GET", undefined, undefined);
	});

	test('initiateDeviceCode', () => {
		const initiateDeviceCodeSpy = jest.spyOn(TokenService, 'initiateDeviceCode').mockImplementation();
		const clientId = '';
		webAuth.initiateDeviceCode(clientId);
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
		const accessToken = '';
		webAuth.offlineTokenCheck(accessToken);
		expect(offlineTokenCheckSpy).toHaveBeenCalledWith(accessToken);
	});

});

// Login Service
describe('Login service functions', () => {
	test('loginWithCredentials', () => {
		const loginWithCredentialsSpy = jest.spyOn(LoginService, 'loginWithCredentials').mockImplementation();
		const options: LoginWithCredentialsRequest = {
			username: '',
			password: '',
			requestId: ''
		}
		webAuth.loginWithCredentials(options);
		expect(loginWithCredentialsSpy).toHaveBeenCalledWith(options);
	});
	
	test('loginWithSocial', () => {
		const loginWithSocialSpy = jest.spyOn(LoginService, 'loginWithSocial').mockImplementation();
		const options: SocialProviderPathParameter = {
			provider: '',
			requestId: ''
		}
		const queryParams: SocialProviderQueryParameter = {
			dc: '',
			device_fp: ''
		}
		webAuth.loginWithSocial(options, queryParams);
		expect(loginWithSocialSpy).toHaveBeenCalledWith(options, queryParams);
	});
	
	test('registerWithSocial', () => {
		const registerWithSocialSpy = jest.spyOn(LoginService, 'registerWithSocial').mockImplementation();
		const options: SocialProviderPathParameter = {
			provider: '',
			requestId: ''
		}
		const queryParams: SocialProviderQueryParameter = {
			dc: '',
			device_fp: ''
		}
		webAuth.registerWithSocial(options, queryParams);
		expect(registerWithSocialSpy).toHaveBeenCalledWith(options, queryParams);
	});
	
	test('passwordlessLogin', () => {
		const passwordlessLoginSpy = jest.spyOn(LoginService, 'passwordlessLogin').mockImplementation();
		const options: PasswordlessLoginRequest = {
			requestId: 'requestId',
			sub: 'sub',
			status_id: 'statusId',
			verificationType: VerificationType.EMAIL
		};
		webAuth.passwordlessLogin(options);
		expect(passwordlessLoginSpy).toHaveBeenCalledWith(options);
	});

	test('consentContinue', () => {
		const consentContinueSpy = jest.spyOn(LoginService, 'consentContinue').mockImplementation();
		const option: LoginPrecheckRequest = {
			track_id: ''
		};
		webAuth.consentContinue(option);
		expect(consentContinueSpy).toHaveBeenCalledWith(option);
	});

	test('mfaContinue', () => {
		const mfaContinueSpy = jest.spyOn(LoginService, 'mfaContinue').mockImplementation();
		const option: MfaContinueRequest = {
			track_id: ''
		};
		webAuth.mfaContinue(option);
		expect(mfaContinueSpy).toHaveBeenCalledWith(option);
	});

	test('firstTimeChangePassword', () => {
		const firstTimeChangePasswordSpy = jest.spyOn(LoginService, 'firstTimeChangePassword').mockImplementation();
		const options: FirstTimeChangePasswordRequest = {
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
		const options: CidaasUser = {
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
			mobile_number_verified: false,
			phone_number: '',
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
			rawJSON: '',
			trackId: '',
			need_reset_password: false
		};
		const headers: ProgressiveRegistrationHeader = {
			requestId: '',
			trackId: '',
			acceptlanguage: ''
		}
		webAuth.progressiveRegistration(options, headers);
		expect(progressiveRegistrationSpy).toHaveBeenCalledWith(options, headers);
	});

	test('loginAfterRegister', () => {
		const loginAfterRegisterSpy = jest.spyOn(LoginService, 'loginAfterRegister').mockImplementation();
		const options: LoginAfterRegisterRequest = {
			device_id: 'deviceId',
			dc: 'dc',
			rememberMe: false,
			trackId: 'trackId',
			device_fp: 'device_fp'
		};
		webAuth.loginAfterRegister(options);
		expect(loginAfterRegisterSpy).toHaveBeenCalledWith(options);
	});

	test('actionGuestLogin', () => {
		const actionGuestLoginSpy = jest.spyOn(LoginService, 'actionGuestLogin').mockImplementation();
		const requestId = '';
		webAuth.actionGuestLogin(requestId);
		expect(actionGuestLoginSpy).toHaveBeenCalledWith(requestId);
	});

});

// Verification Service
describe('Verification service functions', () => {
	test('initiateAccountVerification', () => {
		const initiateAccountVerificationSpy = jest.spyOn(VerificationService, 'initiateAccountVerification').mockImplementation();
		const options: InitiateAccountVerificationRequest = {
			sub: ''
		};
		webAuth.initiateAccountVerification(options);
		expect(initiateAccountVerificationSpy).toHaveBeenCalledWith(options);
	});
	
	test('verifyAccount', () => {
		const verifyAccountSpy = jest.spyOn(VerificationService, 'verifyAccount').mockImplementation();
		const options: VerifyAccountRequest = {
			accvid: '',
			code: ''
		};
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.verifyAccount(options, headers);
		expect(verifyAccountSpy).toHaveBeenCalledWith(options, headers);
	});
	
	test('getMFAList', () => {
		const getMFAListSpy = jest.spyOn(VerificationService, 'getMFAList').mockImplementation();
		const options: GetMFAListRequest = {
			email: '',
			request_id: ''
		};
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.getMFAList(options, headers);
		expect(getMFAListSpy).toHaveBeenCalledWith(options, headers);
	});
	
	test('cancelMFA', () => {
		const cancelMFASpy = jest.spyOn(VerificationService, 'cancelMFA').mockImplementation();
		const options: CancelMFARequest = {
			exchange_id: '',
			reason: '',
			type: ''
		};
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.cancelMFA(options, headers);
		expect(cancelMFASpy).toHaveBeenCalledWith(options, headers);
	});

	test('getAllVerificationList', () => {
		const getAllVerificationListSpy = jest.spyOn(VerificationService, 'getAllVerificationList').mockImplementation();
		const accessToken = '';
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.getAllVerificationList(accessToken, headers);
		expect(getAllVerificationListSpy).toHaveBeenCalledWith(accessToken, headers);
	});

	test('initiateEnrollment', () => {
		const initiateEnrollmentSpy = jest.spyOn(VerificationService, 'initiateEnrollment').mockImplementation();
		const options: InitiateEnrollmentRequest = {
			verification_type: ''
		};
		const accessToken = '';
		webAuth.initiateEnrollment(options, accessToken);
		expect(initiateEnrollmentSpy).toHaveBeenCalledWith(options, accessToken);
	});

	test('getEnrollmentStatus', () => {
		const getEnrollmentStatusSpy = jest.spyOn(VerificationService, 'getEnrollmentStatus').mockImplementation();
		const statusId = '';
		const accessToken = '';
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.getEnrollmentStatus(statusId, accessToken, headers);
		expect(getEnrollmentStatusSpy).toHaveBeenCalledWith(statusId, accessToken, headers);
	});

	test('enrollVerification', () => {
		const enrollVerificationSpy = jest.spyOn(VerificationService, 'enrollVerification').mockImplementation();
		const options: EnrollVerificationRequest = {
			exchange_id: '',
			device_id: '',
			client_id: '',
			pass_code: '',
			fido2_client_response: {} ,
			verification_type: ''
		};
		webAuth.enrollVerification(options);
		expect(enrollVerificationSpy).toHaveBeenCalledWith(options);
	});

	test('checkVerificationTypeConfigured', () => {
		const checkVerificationTypeConfiguredSpy = jest.spyOn(VerificationService, 'checkVerificationTypeConfigured').mockImplementation();
		const options: CheckVerificationTypeConfiguredRequest = {
			email: '',
			request_id: '',
			verification_type: ''
		};
		webAuth.checkVerificationTypeConfigured(options);
		expect(checkVerificationTypeConfiguredSpy).toHaveBeenCalledWith(options);
	});

	test('initiateMFA', () => {
		const initiateMFASpy = jest.spyOn(VerificationService, 'initiateMFA').mockImplementation();
		const options: InitiateMFARequest = {
			usage_type: '',
			request_id: ''
		};
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.initiateMFA(options, undefined, headers);
		expect(initiateMFASpy).toHaveBeenCalledWith(options, undefined, headers);
	});

	test('initiateMFA with access token', () => {
		const initiateMFASpy = jest.spyOn(VerificationService, 'initiateMFA').mockImplementation();
		const options: InitiateMFARequest = {
			usage_type: '',
			request_id: ''
		};
		const accessToken = 'accessToken';
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.initiateMFA(options, accessToken, headers);
		expect(initiateMFASpy).toHaveBeenCalledWith(options, accessToken, headers);
	});

	test('authenticateMFA', () => {
		const authenticateMFASpy = jest.spyOn(VerificationService, 'authenticateMFA').mockImplementation();
		const options: AuthenticateMFARequest = {
			type: '',
			exchange_id: '',
			pass_code: ''
		};
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.authenticateMFA(options, headers);
		expect(authenticateMFASpy).toHaveBeenCalledWith(options, headers);
	});

	test('initiateVerification', () => {
		const initiateVerificationSpy = jest.spyOn(VerificationService, 'initiateVerification').mockImplementation();
		const options: InitiateVerificationRequest = {
			email: ''
		};
		const trackId = '';
  		const method = '';
		webAuth.initiateVerification(options, trackId, method);
		expect(initiateVerificationSpy).toHaveBeenCalledWith(options, trackId, method);
	});

	test('configureVerification', () => {
		const configureVerificationSpy = jest.spyOn(VerificationService, 'configureVerification').mockImplementation();
		const options: ConfigureVerificationRequest = {
			exchange_id: '',
			sub: '',
			pass_code: ''
		};
  		const method = '';
		webAuth.configureVerification(options, method);
		expect(configureVerificationSpy).toHaveBeenCalledWith(options, method);
	});

	test('configureFriendlyName', () => {
		const configureFriendlyNameSpy = jest.spyOn(VerificationService, 'configureFriendlyName').mockImplementation();
		const options: ConfigureFriendlyNameRequest = {
			sub: '',
    		friendly_name: ''
		};
		const trackId = '';
  		const method = '';
		webAuth.configureFriendlyName(options, trackId, method);
		expect(configureFriendlyNameSpy).toHaveBeenCalledWith(options, trackId, method);
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
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.getConsentDetails(options, headers);
		expect(getConsentDetailsSpy).toHaveBeenCalledWith(options, headers);
	});
	
	test('acceptConsent', () => {
		const acceptConsentSpy = jest.spyOn(ConsentService, 'acceptConsent').mockImplementation();
		const options: AcceptConsentRequest = {
			client_id: '',
			consent_id: '',
			consent_version_id: '',
			sub: '',
			scopes: [],
			url: '',
			field_key: '',
			accepted_fields: [],
			accepted_by: '',
			skipped: false,
			action_type: '',
			action_id: '',
			q: '',
			revoked: false
		};
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.acceptConsent(options, headers);
		expect(acceptConsentSpy).toHaveBeenCalledWith(options, headers);
	});
	
	test('getConsentVersionDetails', () => {
		const getConsentVersionDetailsSpy = jest.spyOn(ConsentService, 'getConsentVersionDetails').mockImplementation();
		const options: GetConsentVersionDetailsRequest = {
			consentid: '',
			locale: '',
			access_token: ''
		};
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.getConsentVersionDetails(options, headers);
		expect(getConsentVersionDetailsSpy).toHaveBeenCalledWith(options, headers);
	});
	
	test('acceptScopeConsent', () => {
		const acceptScopeConsentSpy = jest.spyOn(ConsentService, 'acceptScopeConsent').mockImplementation();
		const options: AcceptScopeConsentRequest = {
			client_id: '',
			sub: '',
			scopes: ['']
		};
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.acceptScopeConsent(options, headers);
		expect(acceptScopeConsentSpy).toHaveBeenCalledWith(options, headers);
	});
	
	test('acceptClaimConsent', () => {
		const acceptClaimConsentSpy = jest.spyOn(ConsentService, 'acceptClaimConsent').mockImplementation();
		const options: AcceptClaimConsentRequest = {
			client_id: '',
			sub: '',
			accepted_claims: ['']
		};
		const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
		webAuth.acceptClaimConsent(options, headers);
		expect(acceptClaimConsentSpy).toHaveBeenCalledWith(options, headers);
	});
	
	test('revokeClaimConsent', () => {
		const revokeClaimConsentSpy = jest.spyOn(ConsentService, 'revokeClaimConsent').mockImplementation();
		const options: RevokeClaimConsentRequest = {
			access_token: '',
			client_id: '',
			sub: '',
			revoked_claims: ['']
		};
		webAuth.revokeClaimConsent(options);
		expect(revokeClaimConsentSpy).toHaveBeenCalledWith(options);
	});

});
