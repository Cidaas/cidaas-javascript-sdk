export interface IAuthVerificationAuthenticationRequestEntity extends FaceVerificationAuthenticationRequestEntity {
    type: string;
    verification_type?: string
}

export interface FIDO2EnrollEntity {
    client_response?: any;
    fidoRequestId?: string;
}

export interface FaceVerificationAuthenticationRequestEntity {
    exchange_id: string;
    pass_code?: string;
    client_id: string;
    device_id?: string;
    push_id?: string;
    password?: string;
    upload_attempt?: number;
    fido2_client_response?: FIDO2EnrollEntity;
    single_factor_auth?: boolean;
    captcha?: string;
    captcha_ref?: string;
    bot_captcha_response?: string;
    csrf_token?: string;
}
