export interface GetUserProfileRequest {
    /** Access token needed to authorized api call */
    access_token: string
}

export interface RegisterRequest {
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

export interface GetInviteUserDetailsRequest {
    
    invite_id: string, 
    
    callLatestAPI?: boolean
}