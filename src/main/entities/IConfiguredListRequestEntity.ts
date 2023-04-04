export interface IConfiguredListRequestEntity {
    sub: string;
    email: string;
    mobile_number: string;
    username: string;
    request_id: string;


    verification_types: string[];
    single_factor_sub_ref: string;
    device_fp: string;
    provider: string;
    device_id: string;

    // additional params
    verification_type: string

}