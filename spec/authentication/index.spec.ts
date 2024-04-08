import { IdTokenClaims, SignoutResponse, User } from 'oidc-client-ts';
import { Authentication, OidcManager } from '../../src/main/authentication';

const options = {
	authority: 'baseURL',
	client_id: 'clientId',
	redirect_uri: 'redirectUri',
	post_logout_redirect_uri: 'logoutUri',
	response_type: 'code',
	scope: 'scope'
};
const userManager = new OidcManager(options);
const authentication = new Authentication(options, userManager);
const profile: IdTokenClaims = {
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

test('loginOrRegisterWithBrowser', () => {
    const signinRedirectSpy = jest.spyOn(userManager, 'signinRedirect').mockResolvedValue();
    const viewType = 'view_type';
	void authentication.loginOrRegisterWithBrowser(viewType);
	expect(signinRedirectSpy).toHaveBeenCalledWith({
        extraQueryParams: { view_type: viewType}, 
        redirect_uri: options.redirect_uri
    });
});

test('loginCallback', () => {
    const loginCallbackSpy = jest.spyOn(userManager, 'signinRedirectCallback').mockResolvedValue(user);
	void authentication.loginCallback();
	expect(loginCallbackSpy).toHaveBeenCalled();
});

test('logout', () => {
    const logoutSpy = jest.spyOn(userManager, 'signoutRedirect').mockResolvedValue();
	void authentication.logout();
	expect(logoutSpy).toHaveBeenCalled();
});

test('logoutCallback', () => {
    const response: SignoutResponse = {
        state: null,
        error: null,
        error_description: null,
        error_uri: null,
        userState: undefined
    };
    const logoutCallbackSpy = jest.spyOn(userManager, 'signoutRedirectCallback').mockResolvedValue(response);
	void authentication.logoutCallback();
	expect(logoutCallbackSpy).toHaveBeenCalled();
});

test('popupSignIn', () => {
    jest.spyOn(window, 'open').mockImplementation();
    const popupSignInSpy = jest.spyOn(userManager, 'signinPopup').mockResolvedValue(user);
	void authentication.popupSignIn();
	expect(popupSignInSpy).toHaveBeenCalled();
});

test('popupSignInCallback', () => {
    const popupSignInCallbackSpy = jest.spyOn(userManager, 'signinPopupCallback').mockResolvedValue();
	void authentication.popupSignInCallback();
	expect(popupSignInCallbackSpy).toHaveBeenCalled();
});

test('popupSignOut', () => {
    jest.spyOn(window, 'open').mockImplementation();
    const popupSignOutSpy = jest.spyOn(userManager, 'signoutPopup').mockResolvedValue();
	void authentication.popupSignOut();
	expect(popupSignOutSpy).toHaveBeenCalled();
});

test('popupSignOutCallback', () => {
    const popupSignOutCallbackSpy = jest.spyOn(userManager, 'signoutPopupCallback').mockResolvedValue();
	void authentication.popupSignOutCallback();
	expect(popupSignOutCallbackSpy).toHaveBeenCalled();
});

test('silentSignIn', () => {
    const silentSignInSpy = jest.spyOn(userManager, 'signinSilent').mockResolvedValue(user);
	void authentication.silentSignIn();
	expect(silentSignInSpy).toHaveBeenCalled();
});

test('silentSignInCallback', () => {
    const silentSignInCallbackSpy = jest.spyOn(userManager, 'signinSilentCallback').mockResolvedValue();
	void authentication.silentSignInCallback();
	expect(silentSignInCallbackSpy).toHaveBeenCalled();
});