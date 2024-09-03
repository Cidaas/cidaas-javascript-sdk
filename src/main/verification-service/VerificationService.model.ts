export interface InitiateAccountVerificationRequest {
  /** email of user */
  email?: string;
  /** mobile number of user */
  mobile?: string;
  /** phone number of user */
  phone?: string;
  /** username of user */
  username?: string;
  /** described which medium (email, mobile, username) to be used for verifying user */
  verificationMedium?: string;
  /** can be either CODE, LINK, or GENERAL */
  processingType?: string;
  /** Request id returned from the authorization call */
  requestId?: string;
  /** Unique identifier of client app, can be found in app setting under admin ui */
  client_id?: string;
  /** Specify the url where the user needs to be redirected after successful login */
  redirect_uri?: string;
  /** response type expected for the process */
  response_type?: string;
  /** Subject (User) identifier */
  sub?: string;
  /** Refers to a template or predefined message/key associated with the opt-in reminder. */
  templateKey?: string;
  /** name of user */
  name?: string;
  /** Response language, which is configured in cidaas admin ui */
  accept_language?: string;
}

export interface VerifyAccountRequest {
  /** accvid will be given after initiate account verification process */
  accvid: string;
  /** code which has been sent to predetermined verification medium */
  code: string;
}

export interface GetMFAListRequest {
  /** email of user */
  email: string;
  /** Request id returned from the authorization call */
  request_id: string;
}

export interface CancelMFARequest {
  exchange_id: string;
  reason: string;
  type: string;
}

export interface InitiateEnrollmentRequest {
  verification_type: string;
  deviceInfo?: DeviceInfo;
}

export interface EnrollVerificationRequest {
  exchange_id?: string;
  device_id?: string;
  finger_print?: string;
  client_id?: string;
  push_id?: string;
  pass_code?: string;
  pkce_key?: string;
  face_attempt?: number;
  attempt?: number;
  fido2_client_response?: FIDO2EnrollEntity;
  verification_type?: string;
}

export interface CheckVerificationTypeConfiguredRequest extends GetMFAListRequest {
  verification_type: string;
}

export interface InitiateMFARequest {
  request_id: string;
  usage_type: string;
  type?: string
  email?: string;
  processingType?: string;
  q?: string;
  sub?: string;
  mobile_number?: string;
  username?: string;
  client_id?: string;
  medium_id?: string;
  push_id?: string;
  device_id?: string;
  single_factor_auth?: boolean;
  single_factor_sub_ref?: string;
  trackId?: string;
}

export interface AuthenticateMFARequest {
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
  type: string;
  verification_type?: string;
}

export interface DeviceInfo {
  deviceId: string;
  location: Location;
}

export interface Location {
  lat: string;
  lon: string;
}

export interface FIDO2EnrollEntity {
  client_response?: any;
  fidoRequestId?: string;
}