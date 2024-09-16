import { WebFinger } from "./SharedEntities";

export interface GetClientInfoRequest {
  requestId: string;
}

export interface GetClientInfoResponseData {
  logo_uri?: string;
  login_providers?: string[];
  custom_providers?: ProviderMetaData[];
  saml_providers?: ProviderMetaData[];
  ad_providers?: ProviderMetaData[];
  passwordless_enabled?: boolean;
  imprint_uri?: string;
  policy_uri?: string;
  tos_uri?: string;
  copy_right_info?: string;
  client_name?: string;
  client_display_name?: string;
  captcha_site_key?: string;
  allow_login_with?: string[];
  fds_enabled?: boolean;
  registration_enabled?: boolean;
  client_id?: string;
  
  allowed_mfa?: string[];
  password_policy?: PasswordPolicySetup;
  consentDetails?: ConsentVersion;

  email_verification_required?: boolean;
  mobile_number_verification_required?: boolean;
  allowed_login_providers?: boolean;
  is_remember_me_selected?: boolean;
  primaryColor?: string;
  accentColor?: string;
  backgroundUri?: string;
  allow_guest_login?: boolean;
  contentAlign?: string;
  logoAlign?: string;
  mediaType?: string;
  videoUrl?: string;
  error_page_uri?: string;
  invite_enabled?: boolean;

  webfinger?: WebFinger;
}

export interface getTenantInfoResponseData {
  tenant_key: string;
  tenant_name: string;
  fav_icon_uri: string | undefined;
  custom_field_flatten: boolean;
  allowedLoginWith: string[];
  logo_uri?: string;
  primaryColor?: string;
  accentColor?: string;
  contentAlign?: string;
  logoAlign?: string;
  verificationForMedium?: string
  backgroundUri?: string;
  mediaType?: string;
  videoUrl?: string;
}

  
/////////////////////

export interface Provider {
  redirectUri: string;
  displayName: string;
  logoUrl?: string;
}
  
export interface GroupSelectionResponseData {
  id: string;
  meta_data: GroupSelectionMetadata;
  validation_type: string;
}

export interface GroupSelectionMetadata {
  selectableGroups: SelectableGroups[];
  amr_values?: string[];
}

export interface SelectableGroups{
  groupId: string;
  groupName: string;
  logoURL?: string;
}
  
export interface ProviderMetaData {
  provider_name: string;
  type: string;
  logo_url?: string;
  display_name?: string;
}  

export interface PasswordPolicySetup {
  id: string;
  policy_name: string;
  minimumLength?: number;
  maximumLength?: number;
  noOfSpecialChars?: number;
  noOfDigits?: number;
  lowerAndUpperCase?: boolean;
  validityDays?: number;
  notifyUserBefore?: number;
  preventAlreadyUsedPwd?: boolean;
  preventPersonalInformation?: boolean;
}

export interface ConsentVersion {
  id: string;
  version: number;
  scopes?: string[];
  customField?: string;
  consentType?: string;
  consent_locale?: ConsentLocale;
  consent_locales?: ConsentLocale[];
}

export interface ConsentLocale {
  id: string;
  consent_id: string;
  consent_version_id: string;
  title?: string;
  url?: string;
  content?: string;
  content_agrement_text?: string;
  locale?: string;
}