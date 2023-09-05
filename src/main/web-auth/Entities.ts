import { UserManagerSettings } from "oidc-client-ts";

export interface AcceptResetPasswordEntity {
  resetRequestId: string ;
  exchangeId: string;
  password: string;
  confirmPassword: string;
  provider?: string;
  requestId?: string;
}

export class AccessTokenRequest {
  grant_type?: string;
  code?: string;
  redirect_uri?: string;
  client_id?: string;
  client_secret?: string;
  state?: string;
  scope?: string;
  refresh_token?: string;
  code_verifier?: string;
  username?: string;
  password?: string;
  requestId?: string;
  provider?: string;
  host?: string;
  client_assertion?: string;
  client_assertion_type?: string;

  client_ip?: string;
  captcha?: string;
  locale?: string;
  username_type?: string;
  signature?: string;
  remember_me?: boolean;


  user_agent: string = "";
  ip_address: string = "";
  accept_language: string = "";
  lat: string = "";
  lng: string = "";
  finger_print: string = "";
  referrer: string = "";

  pre_login_id: string = "";

  login_type: string = "";

  // device code flow
  device_code: string = "";

  // for social logins
  sub?: string;
  identityId?: string;
  providerUserId?: string;

  mfa_exchange_id?: string;
  dc?: string;

  field_key?: string;
}
export class PhysicalVerificationLoginRequest {
  q?: string;
  sub?: string;
  requestId?: string;
  status_id?: string;
  verificationType?: string;
  deviceInfo?: IDeviceRequest;
  device_fp?: string;
}
export interface IDeviceRequest {
  userAgent: string;
  ipAddress: string;
  lat: string;
  lon: string;
  deviceId: string;
  usedTime: Date;
  purpose: string;
  requestId: string;
  sub: string;
  pushNotificationId: string;
  deviceMake: string;
  deviceModel: string;
  deviceType: string;
}

export type AccountVerificationRequestEntity = {
  email?: string;
  mobile?: string;
  phone?: string;
  username?: string;
  verificationMedium?: string;
  processingType?: string;
  requestId?: string;
  client_id?: string;
  redirect_uri?: string;
  response_type?: string;
  sub: string;
  templateKey?: string;
  name?: string;
  accept_language?: string;
}

export interface ChangePasswordEntity {
  sub: string;
  identityId: string;
  old_password: string;
  new_password: string;
  confirm_password: string;
  accessToken: string;
}

export interface FidoSetupEntity {
  track_id: string;
  fido_request_type: string;
  mobile_number: string;
  phone: string;
  security_questions: string[];
  verification_type: string;
}

export class FindUserEntity {
  sub: string = "";
  email: string = "";
  mobile: string = "";
  username: string = "";
  customFields: any;
  provider: string = "";
  providerUserId: string = "";
  rememberMe: string = "";
  webfinger: string = "";
  sub_not: string = "";

  //additional param
  requestId: string
}

export interface IAddressEntity {
  formatted: string;
  street_address: string;
  locality: string;
  region: string;
  postal_code: string;
  country: string;
}

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

export interface IConsentAcceptEntity {
  client_id: string;
  consent_id: string;
  consent_version_id: string;
  sub: string;
  scopes: string[];
  url: string;
  matcher: any;
  field_key: string;
  accepted_fields: string[];
  accepted_by: string;
  skipped: boolean;
  action_type: string;
  action_id: string;
  q: string;
  revoked: boolean;
}


export interface IEnrollVerificationSetupRequestEntity {
  exchange_id: string;
  device_id: string;
  finger_print: string;
  client_id: string;
  push_id: string;
  pass_code: string;
  pkce_key: string;


  face_attempt: number;
  attempt: number;

  fido2_client_response: FIDO2EnrollEntity;

  //additional params
  verification_type: string;
}

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

export interface IMobileEntity {
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


export interface ISuggestedMFAActionConfig {
  sub?: string;
  do_not_ask_again?: boolean;
  later?: boolean;
}

export interface IUserEntity {
  userStatus: string;
  user_status: string;
  user_status_reason: string;
  username: string;
  sub: string;
  given_name: string;
  family_name: string;
  middle_name: string;
  nickname: string;
  originalProviderUserId?: string[];
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
  birthdate: Date | null;
  address?: IAddressEntity;
  customFields?: any;
  identityCustomFields?: any;
  password: string;
  provider: string;
  providerUserId: string;
  identityId: string;
  mfa_enabled?: boolean;
  roles: string[];
  userGroups: IUserGroupMap[];
  groups?: IUserGroupMap[];
  rawJSON: string;
  trackId: string;
  need_reset_password: boolean;
}


export interface IUserGroupMap {
  sub: string;
  groupId: string;
  roles: string[];
  appendRole: boolean;
}

export interface IUserLinkEntity {
  master_sub: string;
  user_name_type: string;
  user_name_to_link: string;
  link_accepted_by: string;
  link_response_time: Date;
  link_accepted: boolean;
  communication_type: string;
  verification_status_id: string;
  type: string;
  status: string;
}
export type LoginFormRequestAsyncEntity = {
  username: string;
  password: string;
  requestId: string;
  provider: string;
  captcha: string;
  username_type: string;
  field_key: string;
  bot_captcha_response: string;
  csrf_token: string;
  dc?: string;
  device_fp?: string;
  captcha_ref?: string;
  locale?: string;
  rememberMe: string;
  remember_me: string;
}

export interface LoginFormRequestEntity {
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

export interface ResetPasswordEntity {
  email: string;
  mobile?: string;
  phone?: string;
  username?: string;
  resetMedium: "SMS" | "EMAIL" | "IVR";
  processingType: "CODE" | "LINK";
  requestId: string;
  provider?: string;
  resetPasswordId?: string;
  sub?: string;
}

export class TokenIntrospectionEntity {
  token: string = "";
  token_type_hint?: string;
  roles?: string[];
  scopes?: string[];



  groups?: GroupValidationEntity[];
  strictGroupValidation: boolean = false;
  strictScopeValidation: boolean = false;

  strictRoleValidation: boolean = false;
  strictValidation: boolean = false;

  client_id?: string;
  client_secret?: string;

  request_url?: string;
  request_time?: number;
  request_headers?: any;


}
export class GroupValidationEntity {
  groupId?: string;
  groupType?: string;
  roles?: string[];
  strictRoleValidation: boolean = false;
  strictValidation: boolean = false;
}

export class UpdateReviewDeviceEntity {
  userId: string = "";
  device: string = "";
  browser: string = "";
  location: string = "";
}

export interface UserActivityEntity {
  skip?: Number;
  take?: Number;
  sub?: string;
  startDate?: string;
  endDate?: string;
  events?: [string];
}

export declare class UserEntity {
  userStatus?: string;
  user_status?: string;
  user_status_reason?: string;
  username?: string;
  sub?: string;
  originalProviderUserId?: string[];
  given_name: string;
  family_name: string;
  middle_name?: string;
  nickname?: string;
  email: string;
  email_verified?: boolean;
  mobile_number?: string;
  mobile_number_obj?: IMobileEntity | null;
  mobile_number_verified?: boolean;
  phone_number?: string;
  phone_number_obj?: IMobileEntity | null;
  phone_number_verified?: boolean;
  profile?: string;
  picture?: string;
  website?: string;
  gender?: string;
  zoneinfo?: string;
  locale?: string;
  birthdate?: Date | string;
  address?: AddressEntity;
  customFields?: any;
  identityCustomFields?: any;
  password: string;
  password_echo: string;
  password_hash_info?: any | null;
  generate_password?: boolean;
  provider?: string;
  identityId?: string;
  providerUserId?: string;
  providerBusinessIds?: string[];
  street_address?: string;
  mfa_enabled?: boolean;
  roles?: string[];
  groups?: IUserGroupMap[];
  userGroups?: IUserGroupMap[];
  trackId?: string;
  rawJSON?: string;
  need_reset_password?: boolean;
  no_event?: boolean;
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

export class ValidateResetPasswordEntity {
  resetRequestId: string = "";
  code: string = "";
}

export interface IChangePasswordEntity {
  sub?: string;
  identityId?: string;
  old_password: string;
  new_password: string;
  confirm_password: string;
  accessToken?: string;
  loginSettingsId: string;
  client_id?: string;
}

export interface ICidaasSDKSettings extends UserManagerSettings {
  mode?: string;
  cidaas_version?: number;
}