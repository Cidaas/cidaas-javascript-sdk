import { InvokeIdValidationCaseRequest } from "./IdValidationService.model";
import * as IdValidationService from './IdValidationService';
import { Helper } from "../common/Helper";
import ConfigProvider from "../common/ConfigProvider"
import { OidcClientSettings } from "oidc-client-ts";

const authority = 'baseURL';
const httpSpy = jest.spyOn(Helper, 'createHttpPromise');

const options: OidcClientSettings = {
    authority: authority,
    client_id: '',
    redirect_uri: ''
};
ConfigProvider.setConfig(options);

test('invokeIdValidationCase', () => {
    const options: InvokeIdValidationCaseRequest = {
        redirect_url: 'redirect_url',
        validation_settings_id: 'validation_settings_id'
    };
    const accessToken = 'accessToken';
    const serviceURL = `${authority}/idval-sign-srv/caseinvocation`;
    IdValidationService.invokeIdValidationCase(options, accessToken);
    expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST', accessToken);
});
