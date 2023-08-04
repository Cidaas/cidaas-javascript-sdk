import {
    LoginService,
} from '../../src/main/web-auth/LoginService';
import { TestConstants } from '../TestConstants';

let windowSpy:any;

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
});

afterEach(() => {
    windowSpy.mockRestore();
});

const myHeaders = { requestId:'requestId', trackId: 'trackId',  acceptlanguage: 'en'}

test('progressiveRegistration', () => {

    windowSpy.mockImplementation(() => ({
        location: {
            origin: 'https://kube-nightlybuild-dev.cidaas.de'
        },
        webAuthSettings:{
            authority: ''
        }
    }));
    let data = LoginService.progressiveRegistration(TestConstants.user, myHeaders)
    expect(data).not.toBe(undefined);
});

test('registerWithSocial', () => {
    windowSpy.mockImplementation(() => ({
        location: {
            origin: 'https://kube-nightlybuild-dev.cidaas.de'
        },
        webAuthSettings:{
            authority: ''
        }
    }));
    let data = LoginService.registerWithSocial({provider:'google',requestId:'req1'}, {dc:'1', device_fp:'2'})
    expect(data).not.toBe(null);
});


//Form Submit
test('loginAfterRegister', () => {
    windowSpy.mockImplementation(() => ({
        location: {
            origin: TestConstants.interactiveTestConfig.baseUrl
        },
        webAuthSettings:{
            authority: ''
        }
    }));
    LoginService.loginAfterRegister(TestConstants.user);
    LoginService.loginWithCredentials(TestConstants.loginFormRequest);
    LoginService.firstTimeChangePassword(TestConstants.pwdChange);
    LoginService.loginAfterRegister({trackId:'t',dc:'d',rememberMe:true,device_fp:'f',device_id:''});
    LoginService.firstTimeChangePassword(TestConstants.pwdChange);
    LoginService.scopeConsentContinue({track_id:'t'});
    LoginService.claimConsentContinue({track_id:'t'});
    LoginService.consentContinue({track_id:'t',consent_refs:[''],sub:'',client_id:'',scopes:[''],matcher:''});
    LoginService.passwordlessLogin(TestConstants.physicalVerification);
    //LoginService.mfaContinue({TestConstants.physicalVerification,{trackId:''}});
    LoginService.mfaContinue({track_id:'t'});
    LoginService.loginWithCredentialsAsynFn(TestConstants.loginFormAsyncRequest);
    LoginService.loginWithSocial({requestId:'r',provider:'p'},{dc:'d',device_fp:'dfp'});
});
