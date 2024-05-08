// TODO: add description to each model parameters

export interface CidaasUser {
    // user accounts
    userStatus?: string; // deprecated
    user_status?: string;
    user_status_reason?: string;

    // social identities
    username?: string;
    sub?: string;
    given_name?: string;
    family_name?: string;
    middle_name?: string;
    nickname?: string;
    originalProviderUserId?:string[];
    email?: string;
    email_verified?: boolean;
    mobile_number?: string;
    mobile_number_obj?: UserMobile | null;
    mobile_number_verified?: boolean;
    phone_number?: string;
    phone_number_obj?: UserMobile | null;
    phone_number_verified?: boolean;
    profile?: string;
    picture?: string;
    website?: string;
    gender?: string;
    zoneinfo?: string;
    locale?: string;
    birthdate?: Date | null;
    address?: UserAddress;
    customFields?: any;
    identityCustomFields?: any;
    password?: string;
    provider?: string;
    providerUserId?: string;
    identityId?: string;
    mfa_enabled?: boolean;

    // groups and roles
    roles?: string[];
    userGroups?: UserGroup[]; // deprecated
    groups?: UserGroup[];

    /** Identities JSON Object in string format */
    rawJSON?: string;
    trackId?: string;
    need_reset_password?: boolean;

}

// TODO: found out which one is required & which one is optionals
export interface UserAddress {
    formatted?: string;
    street_address?: string;
    locality?: string;
    region?: string;
    postal_code?: string;
    country?: string;
}

// TODO: found out which one is required & which one is optionals
export interface UserMobile {
    given_phone?: string,
    phone?: string,
    country?: string,
    dail_code?: string,
    carrier_type?: string,
    carrier_name?: string,
    national_format?: string,
    international_format?: string,
    E164_format?: string
}

// TODO: found out which one is required & which one is optionals
export interface UserGroup {
    sub: string;
    groupId: string;
    roles: string[];
    appendRole?: boolean;
}

