export interface LoginWithCredentialsRequest {
    username: string;
    password: string;
    requestId: string;
    provider?: string;
    captcha?: string;
    username_type?: string;
    field_key?: string;
    bot_captcha_response?: string;
    csrf_token?: string;
    dc?: string;
    device_fp?: string;
    captcha_ref?: string;
    locale?: string;
    rememberMe?: boolean;
    remember_me?: boolean;
}