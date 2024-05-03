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