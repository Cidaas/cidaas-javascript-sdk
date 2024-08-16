// TODO: add object properties which hasn't been defined yet
export interface CidaasUser {
    /** Status of User */
    userStatus?: string;
    /** DEPRECATED: use userStatus variable instead */
    user_status?: string;
    /** Reason for user status */
    user_status_reason?: string;
    /** Username of the user */
    username?: string;
    /** Subject (User) identifier */
    sub?: string;

    /** UserId from original provider */
    originalProviderUserId?: string[];

    /** Given/first name of the user */
    given_name?: string;
    /** Surname or last name of the user */
    family_name?: string;
    /** Middle name of the user */
    middle_name?: string;
    /** Casual name of the user */
    nickname?: string;
    /** Email of the user in string */
    email?: string;
    /** Described whether user email has been verified */
    email_verified?: boolean;
    /** Mobile number of the user in string format */
    mobile_number?: string;
    /** Mobile number of the user as object */
    mobile_number_obj?: UserMobile;
    /** Described whether user mobile number has been verified */
    mobile_number_verified?: boolean;
    /** Phone number of the user in string format */
    phone_number?: string;
    /** Phone number of the user as object */
    phone_number_obj?: UserMobile;
    /** Described whether user phone number has been verified */
    phone_number_verified?: boolean;
    /** URL of the user's profile page */
    profile?: string;
    /** URL of the user's profile picture */
    picture?: string;
    /** URL of the user's web page or blog */
    website?: string;
    /** User's gender */
    gender?: string;
    /** Represents the user's time zone */
    zoneinfo?: string;
    /** Preferred locale of the user */
    locale?: string;
    /** User's birthdate in the format 'YYYY-MM-DD' */
    birthdate?: Date | string;
    /** Address of the user */
    address?: UserAddress;
    /** Represents custom-specific fields that need to be configured in the system */
    customFields?: any;
    /** Custom fileds for identity */
    identityCustomFields?: any;
    /** Password of a user */
    password?: string;
    /** Password confirm of a user */
    password_echo?: string;
    /** Hash info of the password */
    password_hash_info?: any | null;
    /** Described wheter new password needs to be generated by the next login */
    generate_password?: boolean;
    /** Provider name indicating the origin of the social identity */
    provider?: string;
    /** the identityId identifying the useraccount and identity uniquely */
    identityId?: string;
    /** User Id of provider */
    providerUserId?: string;
    /** List of BusinessId of provider */
    providerBusinessIds?: string[];
    /** Street Address of a user */
    street_address?: string;
    /** Described whether multi factor authentication is enabled for the user */
    mfa_enabled?: boolean;

    /** List of roles of a user */
    roles?: string[];  
    /** List of groups of a user */
    groups?: UserGroup[];
    /** DEPRECATED: use groups instead */
    userGroups?: UserGroup[];
    /** Identifier generated after successful authentication but unfulfilled prechecks */
    trackId?: string;
    /** User information Json Object in String format */
    rawJSON?: string;
    /** Described whether password reset is needed */
    need_reset_password?: boolean;

    no_event?: boolean;

    /** List of user consents */
    // consents?: IConsentField[] | IConsentTrackingEntity[];
    consent_track_ids?: string[];
    ignore_default_roles?: string[];
    // identities?: IIdentity[];

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

