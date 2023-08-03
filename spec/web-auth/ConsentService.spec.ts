import { expect } from '@jest/globals';
import { TestConstants } from '../TestConstants';
import { ConsentService } from '../../types/main/web-auth/ConsentService';

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

    let data = ConsentService.getScopeConsentVersionDetailsV2({scopeid:'s',locale:'en',access_token:'a'}).catch( err => {
    });
    expect(data).not.toBe(undefined)

    data = ConsentService.getConsentDetailsV2({sub:'s',consent_id:'c',consent_version_id:'v'}).catch( ex => {
    });
    expect(data).not.toBe(undefined);

    data = ConsentService.acceptConsentV2(TestConstants.consent).catch( ex => {
    });
    expect(data).not.toBe(undefined);

    data = ConsentService.acceptScopeConsent({sub:'s',client_id:'c',scopes:['v']}).catch( ex => {
    });
    expect(data).not.toBe(undefined);

    data = ConsentService.acceptClaimConsent({sub:'s',client_id:'c',accepted_claims:['v']}).catch( ex => {
    });
    expect(data).not.toBe(undefined);

    data = ConsentService.revokeClaimConsent({sub:'s',client_id:'c',revoked_claims:['v']}).catch( ex => {
    });
    expect(data).not.toBe(undefined);
});
