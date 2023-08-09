import { WebAuth } from '../../src/main';
import { UserManagerSettings } from 'oidc-client-ts';
import { TestConstants } from '../TestConstants';
declare global {
    interface Window { webAuthSettings: any, authentication:any }
}
let settings:UserManagerSettings;
let webAuth:WebAuth;
beforeEach(() => {

    settings = { authority: TestConstants.interactiveTestConfig.baseUrl,
        client_id: TestConstants.interactiveTestConfig.clientId,
        redirect_uri: TestConstants.interactiveTestConfig.redirectUri };
    window.webAuthSettings =  {
        authority: TestConstants.interactiveTestConfig.baseUrl,
        client_id: TestConstants.interactiveTestConfig.clientId,
        client_secret: TestConstants.interactiveTestConfig.clientSecret,
        redirect_uri:TestConstants.interactiveTestConfig.redirectUrl
    };
    window.authentication =  {
        mode: 'silent',
        client_id: TestConstants.interactiveTestConfig.clientId,
        client_secret: TestConstants.interactiveTestConfig.clientSecret
    };
    webAuth = new WebAuth(settings);
});

test('getRequestId, getClientInfo getRegistrationSetup', async () =>{
    let request:any = await webAuth.getRequestId();
    expect(request).not.toBe(undefined);
    expect(request.data).not.toBe(undefined);
    expect(request.data.requestId).toBeTruthy();
    let clientInfo:any = await webAuth.getClientInfo({requestId:request.data.requestId});
    expect(clientInfo).not.toBe(undefined);
    expect(clientInfo.data).not.toBe(undefined);
    expect(clientInfo.data.client_name).toMatch("javascript-sdk-test-ui");
    let regSetup:any = await webAuth.getRegistrationSetup({acceptlanguage:'en',requestId:request.data.requestId});
    expect(regSetup).not.toBe(undefined);
    expect(regSetup.data).not.toBe(undefined);
    expect(regSetup.data.length).toEqual(6);
});

/*
test('getTenantInfo', async () =>{
    let tenant:any = await webAuth.getTenantInfo();
    expect(tenant).not.toBe(undefined);
    expect(tenant.data).not.toBe(undefined);
    expect(tenant.data.tenant_name).toMatch("Widas Technologie Services GmbH");
});



test('getDeviceInfo', async () =>{
    let devices:any = await webAuth.getDeviceInfo();
    expect(devices).not.toBe(undefined);
    expect(devices.data).not.toBe(undefined);
    expect(devices.data.updated).toEqual(true);
});

test('getDeviceInfo', async () =>{
    let devices:any = await webAuth.getDeviceInfo();
    expect(devices).not.toBe(undefined);
    expect(devices.data).not.toBe(undefined);
    expect(devices.data.updated).toEqual(true);
});
*/

