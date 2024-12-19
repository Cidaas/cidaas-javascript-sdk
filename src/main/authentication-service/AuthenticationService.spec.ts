import { AuthenticationService } from './AuthenticationService';
import { LogoutResponse, OidcSettings, User } from './AuthenticationService.model';
import ConfigUserProvider from '../common/ConfigUserProvider';

const options: OidcSettings = {
	authority: 'baseURL',
	client_id: 'clientId',
	redirect_uri: 'redirectUri',
	post_logout_redirect_uri: 'logoutUri',
	response_type: 'code',
	scope: 'scope'
};
const configUserProvider: ConfigUserProvider = new ConfigUserProvider(options);
const authentication = new AuthenticationService(configUserProvider);
const profile = {
    sub: '',
    iss: '',
    aud: '',
    exp: 0,
    iat: 0
};
const user: User = {
    session_state: null,
    access_token: '',
    token_type: '',
    profile: profile,
    state: undefined,
    expires_in: undefined,
    expired: undefined,
    scopes: [],
    toStorageString: function (): string {
        throw new Error('Function not implemented.');
    }
};

test('registerWithBrowser', () => {
    const signinRedirectSpy = jest.spyOn(authentication.userManager, 'signinRedirect').mockResolvedValue();
    const viewType = 'register';
	authentication.registerWithBrowser();
	expect(signinRedirectSpy).toHaveBeenCalledWith({
        extraQueryParams: { view_type: viewType}, 
        redirect_uri: options.redirect_uri
    });
});

test('loginWithBrowser', () => {
    const signinRedirectSpy = jest.spyOn(authentication.userManager, 'signinRedirect').mockResolvedValue();
    const viewType = 'login';
	authentication.loginWithBrowser();
	expect(signinRedirectSpy).toHaveBeenCalledWith({
        extraQueryParams: { view_type: viewType}, 
        redirect_uri: options.redirect_uri
    });
});

test('popupSignIn', () => {
    jest.spyOn(window, 'open').mockImplementation();
    const popupSignInSpy = jest.spyOn(authentication.userManager, 'signinPopup').mockResolvedValue(user);
	authentication.popupSignIn();
	expect(popupSignInSpy).toHaveBeenCalled();
});

test('loginCallback', () => {
    const loginCallbackSpy = jest.spyOn(authentication.userManager, 'signinCallback').mockResolvedValue(user);
	authentication.loginCallback();
	expect(loginCallbackSpy).toHaveBeenCalled();
});

test('logout', () => {
    const logoutSpy = jest.spyOn(authentication.userManager, 'signoutRedirect').mockResolvedValue();
	authentication.logout();
	expect(logoutSpy).toHaveBeenCalled();
});

test('popupSignOut', () => {
    jest.spyOn(window, 'open').mockImplementation();
    const popupSignOutSpy = jest.spyOn(authentication.userManager, 'signoutPopup').mockResolvedValue();
	authentication.popupSignOut();
	expect(popupSignOutSpy).toHaveBeenCalled();
});

test('logoutCallback', () => {
    const response: LogoutResponse = {
        state: null,
        error: null,
        error_description: null,
        error_uri: null,
        userState: undefined
    };
    const logoutCallbackSpy = jest.spyOn(authentication.userManager, 'signoutCallback').mockResolvedValue(response);
	authentication.logoutCallback();
	expect(logoutCallbackSpy).toHaveBeenCalled();
});

test('renewToken', () => {
    const renewTokenSpy = jest.spyOn(authentication.userManager, 'signinSilent').mockResolvedValue(user);
	authentication.renewToken();
	expect(renewTokenSpy).toHaveBeenCalled();
});

test('getLoginURL', () => {
    const createSigninRequestSpy = jest.spyOn(authentication.userManager.getClient(), 'createSigninRequest').mockResolvedValue({ url: 'empty' } as any);
    authentication.getLoginURL();
    expect(createSigninRequestSpy).toHaveBeenCalled();
});

test('getUserInfoFromStorage', () => {
    const getUserSpy = jest.spyOn(authentication.userManager, 'getUser');
    authentication.getUserInfoFromStorage();
    expect(getUserSpy).toHaveBeenCalled();
});
