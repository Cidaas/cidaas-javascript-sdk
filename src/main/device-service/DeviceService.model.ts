export interface DeleteDeviceRequest {
    /** id of device associated to the client */
    device_id: string;
    /** user-agent information from the browser */
    userAgent?: string;
}