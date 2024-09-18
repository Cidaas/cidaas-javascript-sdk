export interface LogoutUserRequest {
    /** Access token needed to authorized api call */
    access_token: string;
}

export interface GetClientInfoRequest {
    /** Request id returned from the authorization call */
    requestId: string;
}

export interface GetRegistrationSetupRequest {
    /** Request id returned from the authorization call */
    requestId: string;
    /** Response language, which is configured in cidaas admin ui */
    acceptlanguage?: string;
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

export interface UpdateProfileImageRequest {
    /** id for the image */
    image_key: string;
    /** name of the image */
    filename: string;
    /** image file */
    photo: Blob;
}

export interface DeleteDeviceRequest {
    /** id of device associated to the client */
    device_id: string;
    /** user-agent information from the browser */
    userAgent?: string;
}

export interface DateFilter {
    /** earliest time to show activities */
    from_date: string;
    /** latest time to show activities */
    to_date: string;
}

export interface UserActionOnEnrollmentRequest {
    action: string;
}