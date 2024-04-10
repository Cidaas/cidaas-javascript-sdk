export interface TokenHeader {
    /** Algorithm, which is used to secure token */
    alg: string,
    /** Key identifier to verify token signature */
    kid: string
}

export interface TokenClaim {
    /** Issuer identifier */
    iss: string,
    /** Subject (User) identifier */
    sub: string,
    /** Client id, used during authentication or token generation */
    aud: string,
    /** Expiration time of token */
    exp: number,
    /** Time when token was generated */
    iat: number,
    /** A unique identifier for the token, which can be used to prevent reuse of the token */
    jti: string,
    /** Time when active authentication by user was done */
    auth_time?: number,
    /** String value used to associate a client session with an id token, and to mitigate replay attacks */
    nonce?: string,
    /** String specifying an Authentication Context Class Reference value */
    acr?: string,
    /** Authentication Methods References. 
     * JSON array of strings that are identifiers for authentication methods used in the authentication 
     * */
    amr?: string[],
    /** Authorized party 
     * The party to which the ID Token was issued
     * */
    azp?: string,
    /** Access token hash value */
    at_hash?: string,
    /** Code hash value */
    c_hash?: string,
    /** List of user roles */
    roles?: string[],
    /** List of scopes requested */
    scopes?: string[],
    /** List of user group */
    groups?: Group[],
    /** Session identifier */
    sid?: string,
    /** Identity subject. Identity id of the user */
    isub?: string,
    /** Provider user identifier */
    psub?: string,
    /** Not before */
    nbf?: number,
    /** User agent hash */
    ua_hash?: string,
    /** List of unaccepted consents */
    consents?: Consent[],
    /** DEPRECATED: replaced with aud claim */
    clientid?: string,
    /** DEPRECATED: replaced with scopes claim */
    scope?: string,
    /** DEPRECATED: replaced with roles claim */
    role?: string
}

export interface Group {
    /** Unique identifier for the group */
    groupId: string,
    /** List of group roles */
    roles: string[]
}

export interface Consent {
    /** Unique identifier for the consent */
    consent_id: string,
    /** Unique identifier for one particular consent version */
    consent_version_id: string,
    /** Consent Status whether it has been accepted */
    accepted: boolean,
    /** Time when the consent is created */
    creation_time: string
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