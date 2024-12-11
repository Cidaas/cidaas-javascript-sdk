import { IdValidationService } from './IdValidationService';
import { InvokeIdValidationCaseRequest } from "./IdValidationService.model";
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
const configProvider: ConfigProvider = new ConfigProvider(options);
const idValidationService = new IdValidationService(configProvider);

test('invokeIdValidationCase', () => {
    const options: InvokeIdValidationCaseRequest = {
        redirect_url: 'redirect_url',
        validation_settings_id: 'validation_settings_id'
    };
    const accessToken = 'accessToken';
    const serviceURL = `${authority}/idval-sign-srv/caseinvocation`;
    idValidationService.invokeIdValidationCase(options, accessToken);
    expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, 'POST', accessToken);
});
