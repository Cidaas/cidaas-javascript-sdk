import { UserEntity, ResetPasswordEntity, FindUserEntity, IUserLinkEntity, ChangePasswordEntity, ValidateResetPasswordEntity, AcceptResetPasswordEntity } from "./Entities";
export declare namespace UserService {
    /**
     * get user info
     * @param options
     * @returns
     */
    function getUserProfile(options: {
        access_token: string;
    }): Promise<unknown>;
    /**
     * register user
     * @param options
     * @param headers
     * @returns
     */
    function register(options: UserEntity, headers: {
        requestId: string;
        captcha?: string;
        acceptlanguage?: string;
        bot_captcha_response?: string;
        trackId: string;
    }): Promise<unknown>;
    /**
     * get invite info
     * @param options
     * @returns
     */
    function getInviteUserDetails(options: {
        invite_id: string;
    }): Promise<unknown>;
    /**
     * get Communication status
     * @param options
     * @returns
     */
    function getCommunicationStatus(options: {
        sub: string;
        requestId: string;
    }): Promise<unknown>;
    /**
     * initiate reset password
     * @param options
     * @returns
     */
    function initiateResetPassword(options: ResetPasswordEntity): Promise<unknown>;
    /**
     * handle reset password
     * @param options
     */
    function handleResetPassword(options: ValidateResetPasswordEntity): void;
    /**
    * reset password
    * @param options
    */
    function resetPassword(options: AcceptResetPasswordEntity): void;
    /**
     * get Deduplication details
     * @param options
     * @returns
     */
    function getDeduplicationDetails(options: {
        trackId: string;
    }): Promise<unknown>;
    /**
     * deduplication login
     * @param options
     */
    function deduplicationLogin(options: {
        trackId: string;
        requestId: string;
        sub: string;
    }): void;
    /**
     * register Deduplication
     * @param options
     * @returns
     */
    function registerDeduplication(options: {
        trackId: string;
    }): Promise<unknown>;
    /**
     * change password
     * @param options
     * @param access_token
     * @returns
     */
    function changePassword(options: ChangePasswordEntity, access_token: string): Promise<unknown>;
    /**
     * update profile
     * @param options
     * @param access_token
     * @param sub
     * @returns
     */
    function updateProfile(options: UserEntity, access_token: string, sub: string): Promise<unknown>;
    /**
     * initiate link accoount
     * @param options
     * @param access_token
     * @returns
     */
    function initiateLinkAccount(options: IUserLinkEntity, access_token: string): Promise<unknown>;
    /**
     * complete link accoount
     * @param options
     * @param access_token
     * @returns
     */
    function completeLinkAccount(options: {
        code?: string;
        link_request_id?: string;
    }, access_token: string): Promise<unknown>;
    /**
     * get linked users
     * @param access_token
     * @param sub
     * @returns
     */
    function getLinkedUsers(access_token: string, sub: string): Promise<unknown>;
    /**
     * unlink accoount
     * @param access_token
     * @param identityId
     * @returns
     */
    function unlinkAccount(access_token: string, identityId: string): Promise<unknown>;
    /**
     * deleteUserAccount
     * @param options
     * @returns
     */
    function deleteUserAccount(options: {
        access_token: string;
        sub: string;
    }): Promise<unknown>;
    /**
     * check if an user exists
     * @param options
     * @returns
     */
    function userCheckExists(options: FindUserEntity): Promise<unknown>;
}
