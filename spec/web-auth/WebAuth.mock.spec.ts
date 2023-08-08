import { LoginService } from '../../src/main/web-auth/LoginService';
import { TestConstants } from '../TestConstants';
import { WebAuth } from '../../src/main';
import { UserManagerSettings } from 'oidc-client-ts';

let windowSpy:any;
let webAuth:WebAuth;
let settings:UserManagerSettings;

beforeEach(() => {
    windowSpy = jest.spyOn(window, "window", "get");
    const xhrMock: Partial<XMLHttpRequest> = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
        readyState: 4,
        status: 200,
        response: 'Hello World!'
    };
    jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhrMock as XMLHttpRequest);
    jest.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation(() => {
    });
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ test: 100 }),
        }),
    ) as jest.Mock;
    settings = { authority: TestConstants.interactiveTestConfig.baseUrl,
        client_id: TestConstants.interactiveTestConfig.clientId,
        redirect_uri: TestConstants.interactiveTestConfig.redirectUri};

    webAuth = new WebAuth(settings);
});

afterEach(() => {
    windowSpy.mockRestore();
});

test('getMissingFields', async () =>{
    windowSpy.mockImplementation(() => ({
        location: {
            origin: 'https://kube-nightlybuild-dev.cidaas.de'
        },
        webAuthSettings: {
            authority: TestConstants.interactiveTestConfig.baseUrl,
            client_id: TestConstants.interactiveTestConfig.clientId,
            client_secret: TestConstants.interactiveTestConfig.clientSecret,
        },
        authentication: {
            mode: 'silent',
            client_id: TestConstants.testConfig.clientId,
            client_secret: TestConstants.testConfig.clientSecret,
        },
        navigator:{
            userAgent:'Chrome'
        }
    }));
    let data = webAuth.getMissingFields({trackId:'', requestId:''});
    let err:any;
    expect(data).not.toBe(undefined);
    webAuth.registerWithBrowser();
    webAuth.loginWithBrowser();
    webAuth.loginCallback().catch(ex => err = ex);
    webAuth.getUserInfo().then().catch(ex => err = ex);
    webAuth.logout().then().catch(ex => err = ex);
    webAuth.logoutCallback().then().catch(ex => err = ex);
    webAuth.getClientInfo({requestId:''}).then().catch(ex => err = ex);
    webAuth.getDevicesInfo({requestId:''}).then().catch(ex => err = ex);
    webAuth.getDeviceInfo().then().catch(ex => err = ex);
    webAuth.getDevicesInfo({requestId:''}).then().catch(ex => err = ex);
    webAuth.deleteDevice({device_id:''}).then().catch(ex => err = ex);
    webAuth.deleteDevice({device_id:''}).then().catch(ex => err = ex);
    webAuth.getRegistrationSetup({acceptlanguage:'en',requestId:''}).then().catch(ex => err = ex);
    webAuth.getUnreviewedDevices('a','s').then().catch(ex => err = ex);
    webAuth.getReviewedDevices('a','s').then().catch(ex => err = ex);
    webAuth.getUserProfile({access_token:'a'}).then().catch(ex => err = ex);
    //webAuth.getLoginURL();
});
