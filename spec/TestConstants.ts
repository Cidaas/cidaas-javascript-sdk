import { IUserEntity } from '../types/main/web-auth/Entities';
import {
   AcceptResetPasswordEntity,
   AccessTokenRequest,
   AccountVerificationRequestEntity,
   ChangePasswordEntity,
   FaceVerificationAuthenticationRequestEntity,
   FidoSetupEntity,
   FindUserEntity,
   IAuthVerificationAuthenticationRequestEntity,
   IChangePasswordEntity,
   IConfiguredListRequestEntity,
   IConsentAcceptEntity,
   IEnrollVerificationSetupRequestEntity,
   IInitVerificationAuthenticationRequestEntity, ISuggestedMFAActionConfig,
   IUserLinkEntity, LoginFormRequestAsyncEntity, LoginFormRequestEntity,
   PhysicalVerificationLoginRequest, ResetPasswordEntity,
   TokenIntrospectionEntity, UpdateReviewDeviceEntity,
   UserEntity, ValidateResetPasswordEntity,
} from '../src/main/web-auth/Entities';
import { UserManagerSettings } from 'oidc-client-ts';

export class TestConstants {

   static testConfig: any = {
      clientId: '532877a5-ac90-4aa5-813f-f1db02a0f2cc',
      clientSecret: 'fc766277-61a6-401b-9df9-1ef1d08b40f3',
      grantType: 'client_credentials'
   }

   static interactiveTestConfig: any = {
      clientId: '547a2f6b-b232-4edc-bac0-3f40dab05763',
      clientSecret: '01c2f127-219b-4ef4-9599-480c13914adc',
      grantType: 'password',
      baseUrl: 'https://integrationtest-prod.cidaas.eu',
      redirectUrl: 'https://localhost:8080/home.html'
   }

   static user: IUserEntity = {
      birthdate: undefined,
      email: 'test@widas.de',
      email_verified: false,
      family_name: 'Widas',
      gender: 'M',
      given_name: 'Widas',
      identityId: '',
      locale: '',
      middle_name: '',
      mobile_number: '',
      mobile_number_obj: undefined,
      mobile_number_verified: false,
      need_reset_password: false,
      nickname: '',
      password: '',
      phone_number: '',
      phone_number_obj: undefined,
      phone_number_verified: false,
      picture: '',
      profile: '',
      provider: '',
      providerUserId: '',
      rawJSON: '',
      roles: [],
      sub: 'sub',
      trackId: '',
      userGroups: [],
      userStatus: '',
      user_status: '',
      user_status_reason: '',
      username: '',
      website: '',
      zoneinfo: ''
   };

   static accountVerification: AccountVerificationRequestEntity = {
      sub: 'a'
   }

   static configuredList: IConfiguredListRequestEntity = {
      device_fp: 'dfp',
      device_id: 'd1',
      email: 'device@widas.de',
      mobile_number: 'dd',
      provider: 'a',
      request_id: '1',
      single_factor_sub_ref: '1',
      sub: '2',
      username: 'dd1',
      verification_type: 'email',
      verification_types: []
   };

   static enrollVerificationRequest: IEnrollVerificationSetupRequestEntity = {
      attempt: 0,
      client_id: '',
      device_id: '',
      exchange_id: '',
      face_attempt: 0,
      fido2_client_response: undefined,
      finger_print: '',
      pass_code: '',
      pkce_key: '',
      push_id: '',
      verification_type: ''

   }

   static fido: FidoSetupEntity = {
      fido_request_type: '',
      mobile_number: '',
      phone: '',
      security_questions: [],
      track_id: '',
      verification_type: ''
   }

   static authenticationVerificationRequest: IAuthVerificationAuthenticationRequestEntity = {
      client_id: '',
      exchange_id: '',
      type: ''
   };

   static initVerificationRequest: IInitVerificationAuthenticationRequestEntity = {
      client_id: '',
      device_fp: '',
      device_id: '',
      email: '',
      medium_id: '',
      mobile_number: '',
      processingType: '',
      provider: '',
      push_id: '',
      q: '',
      request_id: '',
      single_factor_auth: false,
      single_factor_sub_ref: '',
      sub: '',
      trackId: '',
      usage_type: '',
      username: '',
      verification_types: ['email']
   };

   static changePwd: ChangePasswordEntity = {
      accessToken: 't',
      confirm_password: '',
      identityId: '',
      new_password: '',
      old_password: '',
      sub: ''
   }

   static userEnt: UserEntity = {
      email: '', family_name: '', given_name: '', password: '', password_echo: ''

   };

   static userLink: IUserLinkEntity = {
      communication_type: '',
      link_accepted: false,
      link_accepted_by: '',
      link_response_time: undefined,
      master_sub: '',
      status: '',
      type: '',
      user_name_to_link: '',
      user_name_type: '',
      verification_status_id: ''

   };

   static findUser: FindUserEntity = {
      customFields: undefined,
      email: '',
      mobile: '',
      provider: '',
      providerUserId: '',
      requestId: '',
      sub: '',
      sub_not: '',
      username: ''
   };

   static resetPwd: AcceptResetPasswordEntity = {
      confirmPassword: '', exchangeId: '', password: '', resetRequestId: ''

   };

   static faceVerification: FaceVerificationAuthenticationRequestEntity = { client_id: '', exchange_id: '' };

   static tokenRequest: AccessTokenRequest = {
      accept_language: '',
      device_code: '',
      finger_print: '',
      ip_address: '',
      lat: '',
      lng: '',
      login_type: '',
      pre_login_id: '',
      referrer: '',
      user_agent: ''
   };

   static tokenIntrospect: TokenIntrospectionEntity = {
      strictGroupValidation: false,
      strictRoleValidation: false,
      strictScopeValidation: false,
      strictValidation: false,
      token: ''
   };

   static consent: IConsentAcceptEntity = {
      accepted_by: '',
      accepted_fields: [],
      action_id: '',
      action_type: '',
      client_id: '',
      consent_id: '',
      consent_version_id: '',
      field_key: '',
      matcher: undefined,
      q: '',
      revoked: false,
      scopes: [],
      skipped: false,
      sub: '',
      url: ''
   };

   static pwdChange: IChangePasswordEntity = {
      confirm_password: '',
      loginSettingsId: '',
      new_password: '',
      old_password: ''
   };

   static physicalVerification: PhysicalVerificationLoginRequest = {
      device_fp: 'fp',
      sub: 's',
      requestId: 'r',
      deviceInfo: {
         deviceId: '1', userAgent: 'u', lat: 'a', lon: 'o', ipAddress: 'i',
         usedTime: new Date(), purpose: 'p', requestId: 'r', deviceMake: 'm', deviceModel: 'd', deviceType: 'd', sub: 's', pushNotificationId: ''
      },

   }

   static loginFormRequest: LoginFormRequestEntity = { password: '', requestId: '', username: '' };

   static loginFormAsyncRequest: LoginFormRequestAsyncEntity = {
      bot_captcha_response: '',
      captcha: '',
      csrf_token: '',
      field_key: '',
      password: '',
      provider: '',
      rememberMe: '',
      remember_me: '',
      requestId: '',
      username: '',
      username_type: ''
   };

   static handleResetPwdRequest: ValidateResetPasswordEntity = { code: '', resetRequestId: '' };

   static initiateResetPwd: ResetPasswordEntity = {
      email: '',
      processingType: undefined,
      requestId: '',
      resetMedium: undefined
   };

   static usrManagerSettings: UserManagerSettings = { authority: '', client_id: '', redirect_uri: '' };

   static suggestEnt: ISuggestedMFAActionConfig = {
      sub: 's',
      do_not_ask_again: true,
      later: false
   }

   static deviceReview: UpdateReviewDeviceEntity = { browser: '', device: '', location: '', userId: '' }

}
