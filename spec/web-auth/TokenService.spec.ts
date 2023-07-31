import { TestConstants } from '../TestConstants';
import { TokenService } from '../../types/main/web-auth/TokenService';
import * as buffer from 'buffer';
import { updateSuggestMFA } from '../../src/main/web-auth/TokenService';

let windowSpy:any;

beforeEach(() => {

    const xhrMock: Partial<XMLHttpRequest> = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
        readyState: 4,
        status: 200,
        response: 'Hello World!'
    };
    jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhrMock as XMLHttpRequest);

    windowSpy = jest.spyOn(window, "window", "get");
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
})

test('getAccessToken, renewToken, validateAccessToken', async() => {
    windowSpy.mockImplementation(() => ({
        location: {
            origin: 'https://kube-nightlybuild-dev.cidaas.de'
        },
        webAuthSettings:{
            authority: 'https://kube-nightlybuild-dev.cidaas.de'
        }
    }));

    let data = TokenService.renewToken(TestConstants.tokenRequest).catch( err => {
    });
    expect(data).not.toBe(undefined)

    data = TokenService.getAccessToken(TestConstants.tokenRequest).catch( ex => {
    });
    expect(data).not.toBe(undefined);

    data = TokenService.validateAccessToken(TestConstants.tokenIntrospect).catch( ex => {
    });
    expect(data).not.toBe(undefined)
});

test('getAccessToken, renewToken, validateAccessToken', async() => {
    windowSpy.mockImplementation(() => ({
        location: {
            origin: 'https://kube-nightlybuild-dev.cidaas.de'
        },
        webAuthSettings:{
            authority: 'https://kube-nightlybuild-dev.cidaas.de'
        }
    }));

    let data = TokenService.getScopeConsentDetails({track_id:'tr', locale:'en'}).catch( err => {
    });
    expect(data).not.toBe(undefined);

    data = TokenService.getMissingFieldsLogin('tr').catch( err => {
    });
    expect(data).not.toBe(undefined);

    data =  TokenService.updateSuggestMFA('tr', TestConstants.suggestEnt);
    expect(data).not.toBe(undefined)

    //form submit
    TokenService.deviceCodeVerify('tr');
});
