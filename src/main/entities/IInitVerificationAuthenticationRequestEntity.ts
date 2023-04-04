export interface IInitVerificationAuthenticationRequestEntity {
    q: string;
    sub: string;
    email: string;
    mobile_number: string;
    username: string;

    client_id: string;
    request_id: string;
    usage_type: string;

    medium_id: string;

    single_factor_auth: boolean;

    push_id: string;
    device_id: string;


    single_factor_sub_ref: string;

    verification_types: string[];
    device_fp: string;
    provider: string;
    processingType: string;
    trackId: string;

    //added additionaly
    type?: string
    verification_type?: string
}