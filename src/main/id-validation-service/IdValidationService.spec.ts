import { IdValidationService } from './IdValidationService';
import { InvokeIdValidationCaseRequest } from "./IdValidationService.model";
import { Helper } from "../common/Helper";
import ConfigUserProvider from "../common/ConfigUserProvider"
import { OidcSettings } from '../authentication/Authentication.model';

const authority = 'baseURL';
const httpSpy = jest.spyOn(Helper, 'createHttpPromise');

const options: OidcSettings = {
    authority: authority,
    client_id: '',
    redirect_uri: ''
};
const configUserProvider: ConfigUserProvider = new ConfigUserProvider(options);
const idValidationService: IdValidationService = new IdValidationService(configUserProvider);

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
