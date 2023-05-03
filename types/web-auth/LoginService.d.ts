import { IUserEntity, LoginFormRequestEntity, PhysicalVerificationLoginRequest, LoginFormRequestAsyncEntity, IChangePasswordEntity } from "./Entities";
export declare namespace LoginService {
    /**
   * login with username and password
   * @param options
   */
    function loginWithCredentials(options: LoginFormRequestEntity): void;
    /**
   * login with username and password and return response
   * @param options
   * @returns
   */
    function loginWithCredentialsAsynFn(options: LoginFormRequestAsyncEntity): Promise<Response>;
    /**
     * login with social
     * @param options
     * @param queryParams
     */
    function loginWithSocial(options: {
        provider: string;
        requestId: string;
    }, queryParams: {
        dc: string;
        device_fp: string;
    }): void;
    /**
     * register with social
     * @param options
     * @param queryParams
     */
    function registerWithSocial(options: {
        provider: string;
        requestId: string;
    }, queryParams: {
        dc: string;
        device_fp: string;
    }): void;
    /**
    * passwordless login
    * @param options
    */
    function passwordlessLogin(options: PhysicalVerificationLoginRequest): void;
    /**
     * scope consent continue after token pre check
     * @param options
     */
    function scopeConsentContinue(options: {
        track_id: string;
    }): void;
    /**
     * claim consent continue login
     * @param options
     */
    function claimConsentContinue(options: {
        track_id: string;
    }): void;
    /**
    * consent continue login
    * @param options
    */
    function consentContinue(options: {
        client_id: string;
        consent_refs: string[];
        sub: string;
        scopes: string[];
        matcher: any;
        track_id: string;
    }): void;
    /**
     * mfa continue login
     * @param options
     */
    function mfaContinue(options: PhysicalVerificationLoginRequest & {
        track_id: string;
    }): void;
    /**
     * change password continue
     * @param options
     */
    function firstTimeChangePassword(options: IChangePasswordEntity): void;
    /**
     * progressiveRegistration
     * @param options
     * @param headers
     * @returns
     */
    function progressiveRegistration(options: IUserEntity, headers: {
        requestId: string;
        trackId: string;
        acceptlanguage: string;
    }): Promise<unknown>;
    /**
     * loginAfterRegister
     * @param options
     */
    function loginAfterRegister(options: {
        device_id: string;
        dc?: string;
        rememberMe: boolean;
        trackId: string;
    }): void;
}
