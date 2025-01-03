export interface GetClientInfoRequest {
    /** Request id returned from the authorization call */
    requestId: string;
}

export interface GetRequestIdRequest{
    /** Unique identifier of client app, can be found in app setting under admin ui */
    client_id?: string;
    /** Specify the url where the user needs to be redirected after successful login */
    redirect_uri?: string;
    /** Permissions that are requested for this requestId */
    scope?: string;
    /** Response type expected for the process e.g. token or code */
    response_type?: string;
    /** Response mode defines how the redirect_uri will receive the token or code e.g. as query or fragment */
    response_mode?: string;
    /** String value used to associate a client session with an id token, and to mitigate replay attacks */
    nonce?: string;
    /** Preferred locale of the user */
    ui_locales?: string
}