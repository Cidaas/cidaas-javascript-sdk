export interface LoginPrecheckRequest {
    /** Track id returned from login call */
    track_id: string;
}

/** Type of verification to be used to authenticate user */
export enum VerificationType {
    Password = 'PASSWORD',
    TouchId = 'TOUCHID',
    Fido2 = 'FIDO2',
    SecurityQuestion = 'SECURITY_QUESTION',
    Sms = 'SMS',
    Ivr = 'IVR',
    Face = 'FACE',
    Totp = 'TOTP',
    Email = 'EMAIL',
    BackupCode = 'BACKUPCODE',
    Pattern = 'PATTERN',
    Push = 'PUSH',
    Voice = 'VOICE',
}
export interface HTTPRequestHeader {
    /** Request id returned from the authorization call */
    requestId: string;
    /** Response language, which is configured in cidaas admin ui */
    acceptlanguage?: string;
    /** Identifier generated after successful authentication but unfulfilled prechecks */
    trackId?: string;
    /** Latitude is the string location parameter sent in the headers */
    lat?: string;
    /** Longitude is the string location parameter sent in the headers */
    lon?: string;
}

/** defines whether the the process will be done via email link or whether the user needs to enter a code to complete the process. */
export enum ProcessingType {
    Code = 'CODE',
    Link = 'LINK'
}