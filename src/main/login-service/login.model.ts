import { VerificationType } from "../common/common.model";

export interface LoginWithCredentialsRequest {
    /** User identifier used to login e.g. username, email or mobile number */
    username: string;
    /** Password required to login */
    password: string;
    /** Request id returned from the authorization call */
    requestId: string;
    /** Type of username used in login */
    username_type?: UsernameType;
    /** Field identifier to tell service, where to look for in case of custom username type */
    field_key?: string;
    /** Login provider configured in cidaas admin ui */
    provider?: string;
    /** DEPRECATED: Captcha string for captcha check */
    captcha?: string;
    /** DEPRECATED: Needed in case bot captcha check is activated */
    bot_captcha_response?: string;
    /** DEPRECATED: Token for validating csrf */
    csrf_token?: string;
    /** Device capacity */
    dc?: string;
    /** Device finger print */
    device_fp?: string;
    /** Id of captcha created in cidaas admin ui */
    captcha_ref?: string;
    /** Response language, which is configured in cidaas admin ui */
    locale?: string;
    /** DEPRECATED: Duplicate parameter, will be removed in next major release version */
    rememberMe?: boolean;
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
    /** Type of verification to be used to authenticate user */
    verificationType: VerificationType;
    /** 
     * Masked sub (id of user), who will accept the consent. 
     * Either sub or q have to be provided, depends on what is given from the query parameter. 
     * */
    sub?: string;
    /** 
     * Masked sub (id of user), who will accept the consent. 
     * Either sub or q have to be provided, depends on what is given from the query parameter. 
     * */
    q?: string;
}
