import {
    UserService,
} from '../../src/main/web-auth/UserService';

import { TestConstants } from '../TestConstants';

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


test('updateProfile', () => {
    windowSpy.mockImplementation(() => ({
        location: {
            origin: 'https://kube-nightlybuild-dev.cidaas.de'
        },
        webAuthSettings:{
            authority: 'https://kube-nightlybuild-dev.cidaas.de'
        }
    }));

    let data = UserService.updateProfile(TestConstants.userEnt,TestConstants.changePwd.accessToken,TestConstants.user.sub);
    expect(data).not.toBe(undefined)
});

/*
test('resetPassword', () => {
    windowSpy.mockImplementation(() => ({
        webAuthSettings:{
            authority: 'https://kube-nightlybuild-dev.cidaas.de',
            cidaas_version: 2
        }

    }));

    let data = UserService.resetPassword(TestConstants.resetPwd);
    expect(data).not.toBe(null)
    windowSpy.mockImplementation(() => ({
        location: {
            origin: 'https://kube-nightlybuild-dev.cidaas.de'
        },
        webAuthSettings:{
            authority: 'https://kube-nightlybuild-dev.cidaas.de',
            cidaas_version: 3
        }

    }));

    //Error Form Submit
    // data = UserService.resetPassword(TestConstants.resetPwd);
});
*/



test('resetPassword', async () => {
    windowSpy.mockImplementation(() => ({
        webAuthSettings:{
            authority: 'https://kube-nightlybuild-dev.cidaas.de',
            cidaas_version: 2
        },
        localeSettings: 'en'

    }));
    let data = UserService.resetPassword(TestConstants.resetPwd).catch( err => {
        console.log(`Error ${err}`)
    });
    expect(data).not.toBe(null);
    data = UserService.changePassword(TestConstants.changePwd, 'a').catch( err => {
        console.log(`Error ${err}`)
    });
    expect(data).not.toBe(null);
});

test('getDeduplicationDetails', async () => {
    windowSpy.mockImplementation(() => ({
        webAuthSettings:{
            authority: 'https://kube-nightlybuild-dev.cidaas.de',
            cidaas_version: 3
        },
        localeSettings: 'en'

    }));
    let data = UserService.getDeduplicationDetails({trackId:'tr'}).catch( err => {
        console.log(`Error ${err}`)
    });
    expect(data).not.toBe(null);
});

test('userCheckExists, usw...', async () => {
    windowSpy.mockImplementation(() => ({
        webAuthSettings:{
            authority: 'https://kube-nightlybuild-dev.cidaas.de',
            cidaas_version: 3
        },
        localeSettings: 'en'

    }));
    let data = UserService.userCheckExists(TestConstants.findUser)
    expect(data).not.toBe(null);

    data = UserService.deleteUserAccount({sub:'x',access_token:'a'})
    expect(data).not.toBe(null);

    data = UserService.unlinkAccount('a','id');
    expect(data).not.toBe(null);

    data = UserService.getLinkedUsers('a','id');
    expect(data).not.toBe(null);

    data = UserService.completeLinkAccount({link_request_id:'lrq',code:'cd'},'a');
    expect(data).not.toBe(null);

    data = UserService.initiateLinkAccount(TestConstants.userLink,'a');
    expect(data).not.toBe(null);

    data = UserService.registerDeduplication({trackId:'tr'});
    expect(data).not.toBe(undefined);

    data = UserService.getDeduplicationDetails({trackId:'tr'});
    expect(data).not.toBe(undefined);

    data = UserService.initiateResetPassword(TestConstants.initiateResetPwd);
    expect(data).not.toBe(undefined);

    //Form Submit
    UserService.deduplicationLogin({ trackId: 'tr', requestId: 'r1', sub: 's' });
    await UserService.resetPassword(TestConstants.resetPwd);
    await UserService.handleResetPassword(TestConstants.handleResetPwdRequest);

});

test('cidaasV2', () => {
    windowSpy.mockImplementation(() => ({
        webAuthSettings:{
            authority: 'https://kube-nightlybuild-dev.cidaas.de',
            cidaas_version: 2
        },
        localeSettings: 'en'

    }));
    UserService.handleResetPassword(TestConstants.handleResetPwdRequest);
});


