import { IConfiguredListRequestEntity, IInitVerificationAuthenticationRequestEntity, FidoSetupEntity, IEnrollVerificationSetupRequestEntity, IAuthVerificationAuthenticationRequestEntity, FaceVerificationAuthenticationRequestEntity, AccountVerificationRequestEntity } from "./Entities";
export declare namespace VerificationService {
    /**
       * initiate verification
       * @param options
       * @returns
       */
    function initiateAccountVerification(options: AccountVerificationRequestEntity): void;
    /**
     * initiate verification and return response
     * @param options
     * @returns
     */
    function initiateAccountVerificationAsynFn(options: AccountVerificationRequestEntity): Promise<Response>;
    /**
     * verify account
     * @param options
     * @returns
     */
    function verifyAccount(options: {
        accvid: string;
        code: string;
    }): Promise<unknown>;
    /**
     * get mfa list v2
     * @param options
     * @returns
     */
    function getMFAListV2(options: IConfiguredListRequestEntity): Promise<unknown>;
    /**
     * cancel mfa v2
     * @param options
     * @returns
     */
    function cancelMFAV2(options: {
        exchange_id: string;
        reason: string;
        type: string;
    }): Promise<unknown>;
    /**
     * @param access_token
     * @returns
     */
    function getAllVerificationList(access_token: string): Promise<unknown>;
    /**
     * enrollVerification
     * @param options
     * @returns
     */
    function enrollVerification(options: IEnrollVerificationSetupRequestEntity): Promise<unknown>;
    /**
     * @deprecated This function is no longer supported, instead use {this.updateStatus()}
     * @param status_id
     * @returns
     */
    function updateSocket(status_id: string): Promise<unknown>;
    /**
     * update the status of notification
     * @param status_id
     * @returns
     */
    function updateStatus(status_id: string): Promise<unknown>;
    /**
     * setupFidoVerification
     * @param options
     * @returns
     */
    function setupFidoVerification(options: FidoSetupEntity): Promise<unknown>;
    /**
     * checkVerificationTypeConfigured
     * @param options
     * @returns
     */
    function checkVerificationTypeConfigured(options: IConfiguredListRequestEntity): Promise<unknown>;
    /**
     * initiate mfa v2
     * @param options
     * @returns
     */
    function initiateMFAV2(options: IInitVerificationAuthenticationRequestEntity): Promise<unknown>;
    /**
     * @deprecated
     * @param options
     * @param verificationType
     * @returns
     */
    function initiateMfaV1(options: any, verificationType: string): Promise<unknown>;
    /**
     * authenticate mfa v2
     * @param options
     * @returns
     */
    function authenticateMFAV2(options: IAuthVerificationAuthenticationRequestEntity): Promise<unknown>;
    /**
     * authenticateVerification form type (for face)
     * @param options
     * @returns
     */
    function authenticateFaceVerification(options: FaceVerificationAuthenticationRequestEntity): Promise<unknown>;
    /**
     * @deprecated
     * setup verification - v1
     * @param options
     * @param access_token
     * @param verificationType
     * @returns
     */
    function setupVerificationV1(options: any, access_token: string, verificationType: string): Promise<unknown>;
    /**
     * @deprecated
     * enroll verification - v1
     * @param options
     * @param access_token
     * @param verificationType
     * @returns
     */
    function enrollVerificationV1(options: any, access_token: string, verificationType: string): Promise<unknown>;
    /**
     * @deprecated
     * authenticate mfa - v1
     * @param verificationType
     * @returns
     */
    function authenticateMfaV1(options: any, verificationType: string): Promise<unknown>;
}
