import {
    VerificationService,
} from '../../src/main/web-auth/VerificationService';
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

    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ test: 100 }),
        }),
    ) as jest.Mock;

    //Empty Implementation
    jest.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation(() => {
    });

});

afterEach(() => {
    windowSpy.mockRestore();
})

test('verifyAccount', () => {
    windowSpy.mockImplementation(() => ({
        location: {
            origin: 'https://kube-nightlybuild-dev.cidaas.de'
        },
        webAuthSettings:{
            authority: 'https://kube-nightlybuild-dev.cidaas.de'
        }
    }));

    let data = VerificationService.verifyAccount({accvid:'1', code:'1'});
    expect(data).not.toBe(undefined)
});

test('getMFAListV2', () => {
    windowSpy.mockImplementation(() => ({
        location: {
            origin: 'https://kube-nightlybuild-dev.cidaas.de'
        },
        webAuthSettings:{
            authority: 'https://kube-nightlybuild-dev.cidaas.de'
        }
    }));

    let data = VerificationService.getMFAListV2(TestConstants.configuredList);
    expect(data).not.toBe(undefined)
});

test('cancelMFAV2', () => {
    windowSpy.mockImplementation(() => ({
        location: {
            origin: 'https://kube-nightlybuild-dev.cidaas.de'
        },
        webAuthSettings:{
            authority: 'https://kube-nightlybuild-dev.cidaas.de'
        }
    }));

    let data = VerificationService.cancelMFAV2({type:'typ',exchange_id:'ex1',reason:'1'});
    expect(data).not.toBe(undefined)
});



test('updateStatus, setupFidoVerification, usw..', () => {
    windowSpy.mockImplementation(() => ({
        location: {
            origin: 'https://kube-nightlybuild-dev.cidaas.de'
        },
        webAuthSettings:{
            authority: 'https://kube-nightlybuild-dev.cidaas.de'
        }
    }));

    let data = VerificationService.updateStatus('i');
    expect(data).not.toBe(undefined);

    data = VerificationService.setupFidoVerification(TestConstants.fido);
    expect(data).not.toBe(undefined);

    data = VerificationService.authenticateMFAV2(TestConstants.authenticationVerificationRequest);
    expect(data).not.toBe(undefined);

    data = VerificationService.initiateMFAV2(TestConstants.initVerificationRequest);
    expect(data).not.toBe(undefined);

    data = VerificationService.checkVerificationTypeConfigured(TestConstants.configuredList);
    expect(data).not.toBe(undefined);

    data = VerificationService.setupFidoVerification(TestConstants.fido);
    expect(data).not.toBe(undefined);

    data = VerificationService.authenticateFaceVerification(TestConstants.faceVerification);
    expect(data).not.toBe(undefined);

    data = VerificationService.enrollVerification(TestConstants.enrollVerificationRequest);
    expect(data).not.toBe(undefined);

});



test('getAllVerificationList', async () => {
    windowSpy.mockImplementation(() => ({
        location: {
            origin: 'https://kube-nightlybuild-dev.cidaas.de'
        },
        webAuthSettings:{
            authority: 'https://kube-nightlybuild-dev.cidaas.de'
        }
    }));

    let data =  VerificationService.getAllVerificationList('1');
    expect(data).not.toBe(undefined)
});



//Fetch
test('initiateAccountVerificationAsynFn', async () => {
    windowSpy.mockImplementation(() => ({
        location: {
            origin: 'https://kube-nightlybuild-dev.cidaas.de'
        },
        webAuthSettings:{
            authority: 'https://kube-nightlybuild-dev.cidaas.de'
        }
    }));

    let data = VerificationService.initiateAccountVerificationAsynFn(TestConstants.accountVerification);
    expect(data).not.toBe(undefined);
});

//Form Submit
test('initiateAccountVerification', async () => {
    windowSpy.mockImplementation(() => ({
        location: {
            origin: 'https://kube-nightlybuild-dev.cidaas.de'
        },
        webAuthSettings:{
            authority: 'https://kube-nightlybuild-dev.cidaas.de'
        }
    }));
    VerificationService.initiateAccountVerification(TestConstants.accountVerification);

});

