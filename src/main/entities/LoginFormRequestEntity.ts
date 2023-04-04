export class LoginFormRequestEntity {
  username: string = "";
  password: string = "";
  rememberMe: boolean = false;
  remember_me: boolean = false;
  requestId: string = "";
  provider: string = "";
  captcha: string = "";
  username_type: string = "";
  field_key: string = "";
  bot_captcha_response: string = "";
  csrf_token: string = "";
  dc?: string;
  device_fp?: string;
  captcha_ref?: string;
  locale?: string;
}