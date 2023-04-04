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