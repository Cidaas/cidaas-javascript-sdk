export declare class UserEntity {
  userStatus: string;
  user_status?: string;
  user_status_reason: string;
  username: string;
  sub: string;
  originalProviderUserId?: string[];
  given_name: string;
  family_name: string;
  middle_name: string;
  nickname: string;
  email: string;
  email_verified: boolean;
  mobile_number: string;
  mobile_number_obj: IMobileEntity | null;
  mobile_number_verified: boolean;
  phone_number: string;
  phone_number_obj: IMobileEntity | null;
  phone_number_verified: boolean;
  profile: string;
  picture: string;
  website: string;
  gender: string;
  zoneinfo: string;
  locale: string;
  birthdate: Date | string;
  address?: AddressEntity;
  customFields?: any;
  identityCustomFields?: any;
  password: string;
  password_echo?: string;
  password_hash_info: any | null;
  generate_password: boolean;
  provider: string;
  identityId: string;
  providerUserId: string;
  providerBusinessIds: string[];
  street_address: string;
  mfa_enabled?: boolean;
  roles?: string[];
  groups?: IUserGroupMap[];
  userGroups?: IUserGroupMap[];
  trackId: string;
  rawJSON: string;
  need_reset_password: boolean;
  no_event: boolean;
  consents?: IConsentField[] | IConsentTrackingEntity[];
  consent_track_ids?: string[];
  ignore_default_roles?: string[];
  createdTime?: Date;
  identities?: IIdentity[];
  _id?: string;
  id?: string;
  invite_id?: string
}
export interface IConsentTrackingEntity {
  state?: string;
  fieldKey: string;
  consentId: string;
  versionId?: string;
  time?: Date;
  scopes: string[];
  acceptedBy: string;
}

export interface IConsentField {
  field_key?: string;
  value?: boolean;
}

export interface IUserGroupMap {
  sub: string;
  groupId: string;
  roles: string[];
  appendRole: boolean;
  eventType: string;
  status: number;
}

export declare class AddressEntity {
  formatted: string;
  street_address: string;
  locality: string;
  region: string;
  postal_code: string;
  country: string;
}

export interface IIdentity {
  identityId: string;
  sub: string;
  given_name: string;
  family_name: string;
  middle_name: string;
  nickname: string;
  email: string;
  email_verified: boolean;
  mobile_number: string;
  mobile_number_obj: IMobileEntity;
  mobile_number_verified: boolean;
  phone_number: string;
  phone_number_obj: IMobileEntity;
  phone_number_verified: boolean;
  profile: string;
  picture: string;
  website: string;
  gender: string;
  zoneinfo: string;
  locale: string;
  birthdate: Date | string;
  address: IUserAddress;
  street_address: string;
  provider: string;
  providerUserId: string;
  username: string;
  identityCustomFields: any;
  providerBusinessIds: string[];
  originalProviderUserId?: string[];
  raw_json: string;
  password_hash_info: any | null;
  password: string;
  createdTime: Date;
  updatedTime: Date;
}

export interface IMobileEntity {
  _id: string;
  id: string;
  given_phone: string;
  phone: string;
  country: string;
  dail_code: string;
  carrier_type: string;
  carrier_name: string;
  national_format: string;
  international_format: string;
  E164_format: string;
}

export interface IUserAddress {
  _id: string;
  id: string;
  formatted: string;
  street_address: string;
  locality: string;
  region: string;
  postal_code: string;
  country: string;
}