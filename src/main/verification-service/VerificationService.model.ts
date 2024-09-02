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
}