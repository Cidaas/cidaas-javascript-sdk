import { LoginPrecheckRequest, VerificationType } from "../common/Common.model";

export interface LoginWithCredentialsRequest {
    /** User identifier used to login e.g. username, email or mobile number */
    username: string;
    /** Password required to login */
    password: string;
    /** Request id returned from the authorization call */
    requestId: string;
    /** 
     * Type of username used in login 
     */
    username_type?: UsernameType;
    /** Field identifier to tell service, where to look for in case of custom username type */
    field_key?: string;
    /** Login provider configured in cidaas admin ui */
    provider?: string;
    /** Device capacity */
    dc?: string;
    /** Device finger print */
    device_fp?: string;
    /** Id of captcha created in cidaas admin ui */
    captcha_ref?: string;
    /** Response language, which is configured in cidaas admin ui */
    locale?: string;
    /** Remember me flag to keep user signed in */
    remember_me?: boolean;
}

/** Type of username used in login */
export enum UsernameType {
    Email = 'email',
    Mobile = 'mobile',
    UserName = 'user_name',
    Sub = 'sub',
    IdentityId = 'identityid',
    Custom = 'custom'
}

export interface SocialProviderPathParameter {
    /** Request id returned from the authorization call */
    requestId: string;
    /** Social login provider configured in cidaas admin ui */
    provider: string;
}

export interface SocialProviderQueryParameter {
    /** Device capacity */
    dc?: string;
    /** Device finger print */
    device_fp?: string;
}

export interface PasswordlessLoginRequest {
    /** Request id returned from the authorization call */
    requestId: string;
    /** Status id returned from MFA authentication */
    status_id: string;
    /** 
     * Type of verification to be used to authenticate user
     */
    verificationType: VerificationType;
    /** 
     * Masked sub (id of user)
     * Either sub or q have to be provided, depends on what is given from the query parameter. 
     */
    sub?: string;
    /** 
     * Masked sub (id of user)
     * Either sub or q have to be provided, depends on what is given from the query parameter. 
     */
    q?: string;
}

export interface FirstTimeChangePasswordRequest {
    /** Old password to be changed */
    old_password: string;
    /** New password to replaced old password */
    new_password: string;
    /** Needed to confirm new password */
    confirm_password: string;
}

export interface ProgressiveRegistrationHeader {
    /** Request id returned from the authorization call */
    requestId: string;
    /** Identifier generated after successful authentication but unfulfilled prechecks */
    trackId: string;
    /** Response language, which is configured in cidaas admin ui */
    acceptlanguage?: string;
    /** Latitude is the string location parameter sent in the headers */
    lat?: string;
    /** Longitude is the string location parameter sent in the headers */
    lon?: string;
}

export interface LoginAfterRegisterRequest {
    /** Device capacity */
    dc?: string;
    /** If true, will keep user logged in */
    rememberMe?: boolean;
    /** Identifier generated after successful registration */
    trackId?: string;
    /** Device fingerprint */
    device_fp?: string;
}