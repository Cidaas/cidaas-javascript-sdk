import { ProcessingType } from "../common/Common.model";
import { CidaasUser } from "../common/User.model";

export interface GetUserProfileRequest {
    /** Access token needed to authorized api call. If not provided, access token from UserStorage will be used. */
    access_token?: string
}

export interface GetRegistrationSetupRequest {
    /** Request id returned from the authorization call */
    requestId: string;
    /** Response language, which is configured in cidaas admin ui */
    acceptlanguage?: string;
}

export interface RegisterRequest extends CidaasUser {
    /** id which is generated during user invitation process */
    invite_id?: string;
}

export interface GetInviteUserDetailsRequest {
    /** id which is generated during user invitation process */
    invite_id: string, 
    /** described whether latest api or legacy api should be called */
    callLatestAPI?: boolean
}

export interface GetCommunicationStatusRequest {
    /** Subject (User) identifier */
    sub: string
}

export interface InitiateResetPasswordRequest {
    /** 
     * Type of medium to be used to reset password 
     * BREAKING TODO: change type to ResetMedium only in next major version
     */
    resetMedium: ResetMedium | string;
    /** 
     * defines whether the password can be resetted via email link or whether the user needs to enter a code to complete the reset password process.
     * BREAKING TODO: change type to ProcessingType only in next major version
     */
    processingType: ProcessingType | string;
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
    /** sub of the user who initiates the user link */
    master_sub: string;
    /** type of user name to link. E.g. email */
    user_name_type: string;
    /** username of the user which should get linked */
    user_name_to_link: string;
}

export interface DeleteUserAccountRequest {
    /** Subject (User) identifier */
    sub: string;
    /** Access token needed to authorized api call. If not provided, access token from UserStorage will be used. */
    access_token?: string;
}

export interface CompleteLinkAccountRequest {
    /** code will be sent to account to be linked */
    code?: string; 
    /** value comes from initiateLinkAccount */
    link_request_id?: string;
}

export interface UserCheckExistsRequest {
    /** Request id returned from the authorization call */
    requestId?: string;
    /** Email of user */
    email?: string;
    /** Username of user */
    username?: string;
    /** Mobile number of user */
    mobile?: string;
    /** Custom predefined property to identify user */
    customFields?: { [key: string]: string };
    /** If filled, will be sent as query parameter */
    rememberMe?: string;
    /** If filled, will be sent as query parameter */
    webfinger?: string;
}

export interface GetUserActivitiesRequest {
    /** sub of user to get its activities */
    sub: string;
    /** limits activities number to be shown */
    size?: number;
    /** shows activities starting from the 'from' number. Default is 0 */
    from?: number;
    /** if true, the activites will be sorted with the latest one at start */
    descending?: boolean;
    /** activities are shown based on the dateFilter */
    dateFilter?: DateFilter;
}

export interface UserActionOnEnrollmentRequest {
    /** action to be executed */
    action: string;
}

export interface UpdateProfileImageRequest {
    /** id for the image */
    image_key: string;
    /** name of the image */
    filename: string;
    /** image file */
    photo: Blob;
}

export interface DateFilter {
    /** earliest time to show activities */
    from_date: string;
    /** latest time to show activities */
    to_date: string;
}

/** Type of medium to be used to reset password */
export enum ResetMedium {
    Sms = 'SMS',
    Email = 'EMAIL',
    Ivr = 'IVR'
}