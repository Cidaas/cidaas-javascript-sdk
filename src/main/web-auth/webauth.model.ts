export interface LogoutUserRequest {
    /** Access token needed to authorized api call */
    access_token: string;
}

export interface GetClientInfoRequest {
    /** Request id returned from the authorization call */
    requestId: string;
}