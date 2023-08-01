import { UserManagerSettings } from "oidc-client-ts";
import { AccessTokenRequest, TokenIntrospectionEntity, UserEntity, ResetPasswordEntity, IConfiguredListRequestEntity, IInitVerificationAuthenticationRequestEntity, FindUserEntity, IUserEntity, FidoSetupEntity, IEnrollVerificationSetupRequestEntity, ISuggestedMFAActionConfig, IUserLinkEntity, UpdateReviewDeviceEntity, UserActivityEntity, ChangePasswordEntity, IConsentAcceptEntity, IAuthVerificationAuthenticationRequestEntity, FaceVerificationAuthenticationRequestEntity, LoginFormRequestEntity, AccountVerificationRequestEntity, ValidateResetPasswordEntity, AcceptResetPasswordEntity, LoginFormRequestAsyncEntity, PhysicalVerificationLoginRequest, IChangePasswordEntity } from "./Entities";
export declare class WebAuth {
    constructor(settings: UserManagerSettings & {
        mode?: string;
        cidaas_version: number;
    });
    /**
   * @param string
   * @returns
   */
    private base64URL;
    /**
     * login
     */
    loginWithBrowser(): void;
    /**
     * register
     */
    registerWithBrowser(): void;
    /**
     * login callback
     * @returns
     */
    loginCallback(): Promise<unknown>;
    /**
     * get user info
     * @returns
     */
    getUserInfo(): Promise<any>;
    /**
     * logout
     * @returns
     */
    logout(): Promise<unknown>;
    /**
     * logout callback
     * @returns
     */
    logoutCallback(): Promise<unknown>;
    /**
     * get login url
     * @returns
     */
    getLoginURL(): string;
    /**
     * get request id
     * @returns
     */
    getRequestId(): Promise<unknown>;
    /**
     * get missing fields
     * @param options
     * @returns
     */
    getMissingFields(options: {
        requestId: string;
        trackId: string;
    }): Promise<unknown>;
    /**
     * get Tenant info
     * @returns
     */
    getTenantInfo(): Promise<unknown>;
    /**
     * logout api call
     * @param options
     */
    logoutUser(options: {
        access_token: string;
    }): void;
    /**
     * get Client Info
     * @param options
     * @returns
     */
    getClientInfo(options: {
        requestId: string;
    }): Promise<unknown>;
    /**
     * get all devices associated to the client
     * @param options
     * @returns
     */
    getDevicesInfo(options: any): Promise<unknown>;
    /**
     * delete a device
     * @param options
     * @returns
     */
    deleteDevice(options: {
        device_id: string;
        userAgent?: string;
    }): Promise<unknown>;
    /**
     * get Registration setup
     * @param options
     * @returns
     */
    getRegistrationSetup(options: {
        acceptlanguage: string;
        requestId: string;
    }): Promise<unknown>;
    /**
   * get unreviewed devices
   * @param access_token
   * @param sub
   * @returns
   */
    getUnreviewedDevices(access_token: string, sub: string): Promise<unknown>;
    /**
     * get reviewed devices
     * @param access_token
     * @param sub
     * @returns
     */
    getReviewedDevices(access_token: string, sub: string): Promise<unknown>;
    /**
     * review device
     * @param options
     * @param access_token
     * @returns
     */
    reviewDevice(options: UpdateReviewDeviceEntity, access_token: string): Promise<unknown>;
    /**
     * get device info
     * @returns
     */
    getDeviceInfo(): Promise<unknown>;
    /**
    * get user info
    * @param options
    * @returns
    */
    getUserProfile(options: {
        access_token: string;
    }): Promise<unknown>;
    /**
     * renew token using refresh token
     * @param options
     * @returns
     */
    renewToken(options: AccessTokenRequest): Promise<unknown>;
    /**
     * get access token from code
     * @param options
     * @returns
     */
    getAccessToken(options: AccessTokenRequest): Promise<unknown>;
    /**
     * validate access token
     * @param options
     * @returns
     */
    validateAccessToken(options: TokenIntrospectionEntity): Promise<unknown>;
    /**
     * login with username and password
     * @param options
     */
    loginWithCredentials(options: LoginFormRequestEntity): void;
    /**
     * login with username and password and return response
     * @param options
     * @returns
     */
    loginWithCredentialsAsynFn(options: LoginFormRequestAsyncEntity): Promise<void>;
    /**
     * login with social
     * @param options
     * @param queryParams
     */
    loginWithSocial(options: {
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
    registerWithSocial(options: {
        provider: string;
        requestId: string;
    }, queryParams: {
        dc: string;
        device_fp: string;
    }): void;
    /**
     * register user
     * @param options
     * @param headers
     * @returns
     */
    register(options: UserEntity, headers: {
        requestId: string;
        captcha?: string;
        acceptlanguage?: string;
        bot_captcha_response?: string;
        trackId?: string;
    }): Promise<unknown>;
    /**
     * get invite info
     * @param options
     * @returns
     */
    getInviteUserDetails(options: {
        invite_id: string;
    }): Promise<unknown>;
    /**
     * get Communication status
     * @param options
     * @returns
     */
    getCommunicationStatus(options: {
        sub: string;
        requestId: string;
    }): Promise<unknown>;
    /**
     * initiate verification
     * @param options
     * @returns
     */
    initiateAccountVerification(options: AccountVerificationRequestEntity): void;
    /**
     * initiate verification and return response
     * @param options
     * @returns
     */
    initiateAccountVerificationAsynFn(options: AccountVerificationRequestEntity): Promise<Response>;
    /**
     * verify account
     * @param options
     * @returns
     */
    verifyAccount(options: {
        accvid: string;
        code: string;
    }): Promise<unknown>;
    /**
     * initiate reset password
     * @param options
     * @returns
     */
    initiateResetPassword(options: ResetPasswordEntity): Promise<unknown>;
    /**
     * handle reset password
     * @param options
     */
    handleResetPassword(options: ValidateResetPasswordEntity): Promise<unknown>;
    /**
    * reset password
    * @param options
    */
    resetPassword(options: AcceptResetPasswordEntity): Promise<unknown>;
    /**
     * get mfa list v2
     * @param options
     * @returns
     */
    getMFAListV2(options: IConfiguredListRequestEntity): Promise<unknown>;
    /**
     * cancel mfa v2
     * @param options
     * @returns
     */
    cancelMFAV2(options: {
        exchange_id: string;
        reason: string;
        type: string;
    }): Promise<unknown>;
    /**
     * passwordless login
     * @param options
     */
    passwordlessLogin(options: PhysicalVerificationLoginRequest): void;
    /**
     * get user consent details
     * @param options
     * @returns
     */
    getConsentDetailsV2(options: {
        consent_id: string;
        consent_version_id: string;
        sub: string;
    }): Promise<unknown>;
    /**
     * accept consent v2
     * @param options
     * @returns
     */
    acceptConsentV2(options: IConsentAcceptEntity): Promise<unknown>;
    /**
     * get scope consent details
     * @param options
     * @returns
     */
    getScopeConsentDetails(options: {
        track_id: string;
        locale: string;
    }): Promise<unknown>;
    /**
     * get scope consent version details
     * @param options
     * @returns
     */
    getScopeConsentVersionDetailsV2(options: {
        scopeid: string;
        locale: string;
        access_token: string;
    }): Promise<unknown>;
    /**
     * accept scope Consent
     * @param options
     * @returns
     */
    acceptScopeConsent(options: {
        client_id: string;
        sub: string;
        scopes: string[];
    }): Promise<unknown>;
    /**
     * scope consent continue login
     * @param options
     */
    scopeConsentContinue(options: {
        track_id: string;
    }): void;
    /**
     * accept claim Consent
     * @param options
     * @returns
     */
    acceptClaimConsent(options: {
        client_id: string;
        sub: string;
        accepted_claims: string[];
    }): Promise<unknown>;
    /**
     * claim consent continue login
     * @param options
     */
    claimConsentContinue(options: {
        track_id: string;
    }): void;
    /**
     * revoke claim Consent
     * @param options
     * @returns
     */
    revokeClaimConsent(options: {
        client_id: string;
        sub: string;
        revoked_claims: string[];
    }): Promise<unknown>;
    /**
     * get Deduplication details
     * @param options
     * @returns
     */
    getDeduplicationDetails(options: {
        trackId: string;
    }): Promise<unknown>;
    /**
     * deduplication login
     * @param options
     */
    deduplicationLogin(options: {
        trackId: string;
        requestId: string;
        sub: string;
    }): void;
    /**
     * register Deduplication
     * @param options
     * @returns
     */
    registerDeduplication(options: {
        trackId: string;
    }): Promise<unknown>;
    /**
     * accepts any as the request
     * consent continue login
     * @param options
     */
    consentContinue(options: {
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
    mfaContinue(options: PhysicalVerificationLoginRequest & {
        track_id: string;
    }): void;
    /**
     * change password continue
     * @param options
     */
    firstTimeChangePassword(options: IChangePasswordEntity): void;
    /**
     * change password
     * @param options
     * @param access_token
     * @returns
     */
    changePassword(options: ChangePasswordEntity, access_token: string): Promise<unknown>;
    /**
     * update profile
     * @param options
     * @param access_token
     * @param sub
     * @returns
     */
    updateProfile(options: UserEntity, access_token: string, sub: string): Promise<unknown>;
    /**
     * get user activities
     * @param options
     * @param access_token
     * @returns
     */
    getUserActivities(options: UserActivityEntity, access_token: string): Promise<unknown>;
    /**
     * @param access_token
     * @returns
     */
    getAllVerificationList(access_token: string): Promise<unknown>;
    /**
     * initiate link accoount
     * @param options
     * @param access_token
     * @returns
     */
    initiateLinkAccount(options: IUserLinkEntity, access_token: string): Promise<unknown>;
    /**
     * complete link accoount
     * @param options
     * @param access_token
     * @returns
     */
    completeLinkAccount(options: {
        code?: string;
        link_request_id?: string;
    }, access_token: string): Promise<unknown>;
    /**
     * get linked users
     * @param access_token
     * @param sub
     * @returns
     */
    getLinkedUsers(access_token: string, sub: string): Promise<unknown>;
    /**
     * unlink accoount
     * @param access_token
     * @param identityId
     * @returns
     */
    unlinkAccount(access_token: string, identityId: string): Promise<unknown>;
    /**
     * image upload
     * @param options
     * @param access_token
     * @returns
     */
    updateProfileImage(options: {
        image_key: string;
    }, access_token: string): Promise<unknown>;
    /**
     * updateSuggestMFA
     * @param track_id
     * @param options
     * @returns
     */
    updateSuggestMFA(track_id: string, options: ISuggestedMFAActionConfig): Promise<unknown>;
    /**
     * enrollVerification
     * @param options
     * @returns
     */
    enrollVerification(options: IEnrollVerificationSetupRequestEntity): Promise<unknown>;
    /**
     * @deprecated This function is no longer supported, instead use {this.updateStatus()}
     * @param status_id
     * @returns
     */
    updateSocket(status_id: string): Promise<unknown>;
    /**
     * update the status of notification
     * @param status_id
     * @returns
     */
    updateStatus(status_id: string): Promise<unknown>;
    /**
     * setupFidoVerification
     * @param options
     * @returns
     */
    setupFidoVerification(options: FidoSetupEntity): Promise<unknown>;
    /**
     * checkVerificationTypeConfigured
     * @param options
     * @returns
     */
    checkVerificationTypeConfigured(options: IConfiguredListRequestEntity): Promise<unknown>;
    /**
     * deleteUserAccount
     * @param options
     * @returns
     */
    deleteUserAccount(options: {
        access_token: string;
        sub: string;
    }): Promise<unknown>;
    /**
     * getMissingFieldsLogin
     * @param trackId
     * @returns
     */
    getMissingFieldsLogin(trackId: string): Promise<unknown>;
    /**
     * progressiveRegistration
     * @param options
     * @param headers
     * @returns
     */
    progressiveRegistration(options: IUserEntity, headers: {
        requestId: string;
        trackId: string;
        acceptlanguage: string;
    }): Promise<unknown>;
    /**
     * loginAfterRegister
     * @param options
     */
    loginAfterRegister(options: {
        device_id: string;
        dc?: string;
        rememberMe: boolean;
        trackId: string;
    }): void;
    /**
     * device code flow - verify
     * @param code
     */
    deviceCodeVerify(code: string): void;
    /**
     * check if an user exists
     * @param options
     * @returns
     */
    userCheckExists(options: FindUserEntity): Promise<unknown>;
    /**
     * To set accept language
     * @param acceptLanguage
     */
    setAcceptLanguageHeader(acceptLanguage: string): void;
    /**
     * initiate mfa v2
     * @param options
     * @returns
     */
    initiateMFAV2(options: IInitVerificationAuthenticationRequestEntity): Promise<unknown>;
    /**
     * initiateVerification
     * @param options
     */
    initiateVerification(options: IInitVerificationAuthenticationRequestEntity): void;
    /**
     * initiate email v2
     * @param options
     */
    initiateEmailV2(options: IInitVerificationAuthenticationRequestEntity): void;
    /**
     * initiate sms v2
     * @param options
     */
    initiateSMSV2(options: IInitVerificationAuthenticationRequestEntity): void;
    /**
     * initiate ivr v2
     * @param options
     */
    initiateIVRV2(options: IInitVerificationAuthenticationRequestEntity): void;
    /**
     * initiate backupcode v2
     * @param options
     */
    initiateBackupcodeV2(options: IInitVerificationAuthenticationRequestEntity): void;
    /**
     * initiate totp v2
     * @param options
     */
    initiateTOTPV2(options: IInitVerificationAuthenticationRequestEntity): void;
    /**
     * initiate pattern v2
     * @param options
     */
    initiatePatternV2(options: IInitVerificationAuthenticationRequestEntity): void;
    /**
     * initiate touchid v2
     * @param options
     */
    initiateTouchIdV2(options: IInitVerificationAuthenticationRequestEntity): void;
    /**
     * initiate smart push v2
     * @param options
     */
    initiateSmartPushV2(options: IInitVerificationAuthenticationRequestEntity): void;
    /**
     * initiate face v2
     * @param options
     */
    initiateFaceV2(options: IInitVerificationAuthenticationRequestEntity): void;
    /**
     * initiate voice v2
     * @param options
     */
    initiateVoiceV2(options: IInitVerificationAuthenticationRequestEntity): void;
    /**
     * @deprecated
     * @param options
     * @param verificationType
     * @returns
     */
    initiateMfaV1(options: any, verificationType: string): Promise<unknown>;
    /**
    * @deprecated
    * initiate email - v1
    * @param options
    */
    initiateEmail(options: any): void;
    /**
    * @deprecated
    * initiate SMS - v1
    * @param options
    */
    initiateSMS(options: any): void;
    /**
    * @deprecated
    * initiate IVR - v1
    * @param options
    */
    initiateIVR(options: any): void;
    /**
    * @deprecated
    * initiate backup code - v1
    * @param options
    */
    initiateBackupcode(options: any): void;
    /**
     * @deprecated
     * initiate TOTP - v1
     * @param options
     */
    initiateTOTP(options: any): void;
    /**
    * @deprecated
    * initiate pattern - v1
    * @param options
    */
    initiatePattern(options: any): void;
    /**
    * @deprecated
    * initiate touchid - v1
    * @param options
    */
    initiateTouchId(options: any): void;
    /**
      * @deprecated
      * initiate push - v1
      * @param options
      */ initiateSmartPush(options: any): void;
    /**
    * @deprecated
    * initiate face - v1
    * @param options
    */
    initiateFace(options: any): void;
    /**
     * @deprecated
     * initiate Voice - v1
     * @param options
     */
    initiateVoice(options: any): void;
    /**
     * authenticate mfa v2
     * @param options
     * @returns
     */
    authenticateMFAV2(options: IAuthVerificationAuthenticationRequestEntity): Promise<unknown>;
    /**
     * authenticateVerification
     * @param options
     */
    authenticateVerification(options: IAuthVerificationAuthenticationRequestEntity): void;
    /**
     * authenticate email v2
     * @param options
     */
    authenticateEmailV2(options: IAuthVerificationAuthenticationRequestEntity): void;
    /**
     * authenticate sms v2
     * @param options
     */
    authenticateSMSV2(options: IAuthVerificationAuthenticationRequestEntity): void;
    /**
     * authenticate ivr v2
     * @param options
     */
    authenticateIVRV2(options: IAuthVerificationAuthenticationRequestEntity): void;
    /**
     * authenticate backupcode v2
     * @param options
     */
    authenticateBackupcodeV2(options: IAuthVerificationAuthenticationRequestEntity): void;
    /**
     * authenticate totp v2
     * @param options
     */
    authenticateTOTPV2(options: IAuthVerificationAuthenticationRequestEntity): void;
    /**
     * authenticateVerification form type (for face)
     * @param options
     * @returns
     */
    authenticateFaceVerification(options: FaceVerificationAuthenticationRequestEntity): Promise<unknown>;
    /**
     * @deprecated
     * setup verification - v1
     * @param options
     * @param access_token
     * @param verificationType
     * @returns
     */
    setupVerificationV1(options: any, access_token: string, verificationType: string): Promise<unknown>;
    /**
     * @deprecated
     * setup email - v1
     * @param options
     * @param access_token
     */
    setupEmail(options: any, access_token: string): void;
    /**
     * @deprecated
     * setup sms - v1
     * @param options
     * @param access_token
     */
    setupSMS(options: any, access_token: string): void;
    /**
     * @deprecated
     * setup ivr - v1
     * @param options
     * @param access_token
     */
    setupIVR(options: any, access_token: string): void;
    /**
     * @deprecated
     * setup backupcode - v1
     * @param options
     * @param access_token
     */
    setupBackupcode(options: any, access_token: string): void;
    /**
     * @deprecated
     * setup totp - v1
     * @param options
     * @param access_token
     */
    setupTOTP(options: any, access_token: string): void;
    /**
     * @deprecated
     * setup pattern - v1
     * @param options
     * @param access_token
     */
    setupPattern(options: any, access_token: string): void;
    /**
     * @deprecated
     * setup touch - v1
     * @param options
     * @param access_token
     */
    setupTouchId(options: any, access_token: string): void;
    /**
     * @deprecated
     * setup smart push - v1
     * @param options
     * @param access_token
     */
    setupSmartPush(options: any, access_token: string): void;
    /**
     * @deprecated
     * setup face - v1
     * @param options
     * @param access_token
     */
    setupFace(options: any, access_token: string): void;
    /**
     * @deprecated
     * setup voice - v1
     * @param options
     * @param access_token
     */
    setupVoice(options: any, access_token: string): void;
    /**
     * @deprecated
     * enroll verification - v1
     * @param options
     * @param access_token
     * @param verificationType
     * @returns
     */
    enrollVerificationV1(options: any, access_token: string, verificationType: string): Promise<unknown>;
    /**
     * @deprecated
     * enroll email - v1
     * @param options
     * @param access_token
     */
    enrollEmail(options: any, access_token: string): void;
    /**
     * @deprecated
     * enroll SMS - v1
     * @param options
     * @param access_token
     */
    enrollSMS(options: any, access_token: string): void;
    /**
     * @deprecated
     * enroll IVR - v1
     * @param options
     * @param access_token
     */
    enrollIVR(options: any, access_token: string): void;
    /**
     * @deprecated
     * enroll TOTP - v1
     * @param options
     * @param access_token
     */
    enrollTOTP(options: any, access_token: string): void;
    /**
     * @deprecated
     * authenticate mfa - v1
     * @param verificationType
     * @returns
     */
    authenticateMfaV1(options: any, verificationType: string): Promise<unknown>;
    /**
     * @deprecated
     * authenticate email - v1
     * @param options
     */
    authenticateEmail(options: any): void;
    /**
     * @deprecated
     * authenticate sms - v1
     * @param options
     */
    authenticateSMS(options: any): void;
    /**
     * @deprecated
     * authenticate ivr - v1
     * @param options
     */
    authenticateIVR(options: any): void;
    /**
     * @deprecated
     * authenticate backupcode - v1
     * @param options
     */
    authenticateBackupcode(options: any): void;
    /**
     * @deprecated
     * authenticate totp - v1
     * @param options
     */
    authenticateTOTP(options: any): void;
}
