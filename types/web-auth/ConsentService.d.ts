import { IConsentAcceptEntity } from "./Entities";
export declare namespace ConsentService {
    /**
    * get user consent details
    * @param options
    * @returns
    */
    function getConsentDetailsV2(options: {
        consent_id: string;
        consent_version_id: string;
        sub: string;
    }): Promise<unknown>;
    /**
     * accept constn v2
     * @param options
     * @returns
     */
    function acceptConsentV2(options: IConsentAcceptEntity): Promise<unknown>;
    /**
     * get scope consent version details
     * @param options
     * @returns
     */
    function getScopeConsentVersionDetailsV2(options: {
        scopeid: string;
        locale: string;
        access_token: string;
    }): Promise<unknown>;
    /**
     * accept scope Consent
     * @param options
     * @returns
     */
    function acceptScopeConsent(options: {
        client_id: string;
        sub: string;
        scopes: string[];
    }): Promise<unknown>;
    /**
     * accept claim Consent
     * @param options
     * @returns
     */
    function acceptClaimConsent(options: {
        client_id: string;
        sub: string;
        accepted_claims: string[];
    }): Promise<unknown>;
    /**
     * revoke claim Consent
     * @param options
     * @returns
     */
    function revokeClaimConsent(options: {
        client_id: string;
        sub: string;
        revoked_claims: string[];
    }): Promise<unknown>;
}
