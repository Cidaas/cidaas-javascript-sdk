export interface LoginPrecheckRequest {
    /** Track id returned from login call */
    track_id: string;
}

/** Type of verification to be used to authenticate user */
export enum VerificationType {
    'PASSWORD',
    'TOUCHID',
    'FIDO2',
    'SECURITY_QUESTION',
    'SMS',
    'IVR',
    'FACE',
    'TOTP',
    'EMAIL',
    'BACKUPCODE',
    'PATTERN',
    'PUSH',
    'VOICE',
}
export interface HTTPRequestHeader {
    /** Request id returned from the authorization call */
    requestId: string;
    /** DEPRECATED: Captcha string for captcha check */
    captcha?: string;
    /** Response language, which is configured in cidaas admin ui */
    acceptlanguage?: string;
    /** DEPRECATED: Needed in case bot captcha check is activated */
    bot_captcha_response?: string;
    /** Identifier generated after successful authentication but unfulfilled prechecks */
    trackId?: string;
}
