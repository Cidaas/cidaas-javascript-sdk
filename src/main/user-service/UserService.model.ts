export interface GetUserProfileRequest {
    /** Access token needed to authorized api call */
    access_token: string
}

export interface GetInviteUserDetailsRequest {
    /** id which is generated during user invitation process */
    invite_id: string, 
    /** described whether latest api or legacy api should be called */
    callLatestAPI?: boolean
}

export interface getCommunicationStatusRequest {
    /** Subject (User) identifier */
    sub: string
}

export interface InitiateResetPasswordRequest {
    /** Type of medium to be used to reset password */
    resetMedium: ResetMedium;
    /** defines whether the password can be resetted via email link or whether the user needs to enter a code to complete the reset password process. */
    processingType: ProcessingType;
    /** Email of the user */
    email?: string;
    /** Mobile number of the user */
    mobile?: string;
    /** Phone number of the user */
    phone?: string;
    /** Username of the user */
    username?: string;
    /** Request id returned from the authorization call */
    requestId?: string;
    /** Provider name indicating the origin of the social identity */
    provider?: string;
    /** Id of the reset password process */
    resetPasswordId?: string;
    /** Subject (User) identifier */
    sub?: string;
}

export interface HandleResetPasswordRequest {
    /** Returned from the initiation of password reset call as rprq */
    resetRequestId: string;
    /** One time password code send to the user after the initiation of password reset is complete*/
    code: string;
}

export interface ResetPasswordRequest {
    /** Returned from the initiation of password reset call as rprq */
    resetRequestId: string;
    /** Returned from the after handleResetPassword process is completed */
    exchangeId: string;
    /** New password to be applied to the user */
    password: string;
    /** Confirmation of New password to be applied to the user */
    confirmPassword: string;
    /** Provider name indicating the origin of the social identity */
    provider?: string;
    /** Request id returned from the authorization call */
    requestId?: string;
}

export interface GetDeduplicationDetailsRequest {
    /** Identifier generated after successful authentication but unfulfilled prechecks */
    trackId: string
}

export interface RegisterDeduplicationRequest {
    /** Identifier generated after successful authentication but unfulfilled prechecks */
    trackId: string
}

export interface DeduplicationLoginRequest {
    /** Identifier generated after successful authentication but unfulfilled prechecks */
    trackId: string,
    /** Request id returned from the authorization call */
    requestId: string,
    /** Subject (User) identifier */
    sub: string,
    /** Password of a user */
    password?: string
}

export interface ChangePasswordRequest {
    /** Subject (User) identifier */
    sub: string;
    /** Unique id of the users identity */
    identityId?: string;
    /** Old password of user */
    old_password: string;
    /** New password for user */
    new_password: string;
    /** Confirmation of user's new password */
    confirm_password: string;
}

export interface InitiateLinkAccountRequest {
    master_sub: string;
    user_name_type: string;
    user_name_to_link: string;
    link_accepted_by: string;
    link_response_time: Date;
    link_accepted: boolean;
    communication_type: string;
    verification_status_id: string;
    type: string;
    status: string;
}

export interface completeLinkAccountRequest {
    code?: string; 
    link_request_id?: string;
}

/** Type of medium to be used to reset password */
export enum ResetMedium {
    'SMS',
    'EMAIL',
    'IVR'
}

/** defines whether the password can be resetted via email link or whether the user needs to enter a code to complete the reset password process. */
export enum ProcessingType {
    'CODE',
    'LINK'
}