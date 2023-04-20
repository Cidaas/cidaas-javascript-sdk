import { AccessTokenRequest, TokenIntrospectionEntity, ISuggestedMFAActionConfig } from "./Entities";
export declare namespace TokenService {
    /**
     * renew token using refresh token
     * @param options
     * @returns
     */
    function renewToken(options: AccessTokenRequest): Promise<unknown>;
    /**
     * get access token from code
     * @param options
     * @returns
     */
    function getAccessToken(options: AccessTokenRequest): Promise<unknown>;
    /**
     * validate access token
     * @param options
     * @returns
     */
    function validateAccessToken(options: TokenIntrospectionEntity): Promise<unknown>;
    /**
     * get scope consent details
     * @param options
     * @returns
     */
    function getScopeConsentDetails(options: {
        track_id: string;
        locale: string;
    }): Promise<unknown>;
    /**
     * updateSuggestMFA
     * @param track_id
     * @param options
     * @returns
     */
    function updateSuggestMFA(track_id: string, options: ISuggestedMFAActionConfig): Promise<unknown>;
    /**
     * getMissingFieldsLogin
     * @param trackId
     * @returns
     */
    function getMissingFieldsLogin(trackId: string): Promise<unknown>;
    /**
     * device code flow - verify
     * @param code
     */
    function deviceCodeVerify(code: string): void;
}
