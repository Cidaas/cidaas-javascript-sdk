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
    /** Authentication Methods References. JSON array of strings that are identifiers for authentication methods used in the authentication */
    amr?: string[],
    /** Authorized party. The party to which the ID Token was issued */
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

/** Type of grant used in token request */
export enum GrantType {
  AuthorizationCode = 'authorization_code',
  Implicit = 'implicit',
  RefreshToken = 'refresh_token',
  Password = 'password',
  ClientCredentials = 'client_credentials',
  Internal = 'internal',
  DeviceCode = 'urn:ietf:params:oauth:grant-type:device_code'
}

export interface GenerateTokenFromCodeRequest {
  /** The code which you receive while using authorization code flow */
  code: string;
  /** When we choose PKCE method to generate token, we need to pass code_verifier which is a cryptographically random string */
  code_verifier?: string;
  /** Unique identifier of client app, can be found in app setting under admin ui */
  client_id?: string;
  /** 
   * Type of grant used in token request 
   * BREAKING TODO: change type to GrantType only in next major version
   */
  grant_type?: GrantType | string;
  /** Specify the url where the user needs to be redirected after successful login */
  redirect_uri?: string;
}

/** Optional hint about the type of the submitted token. */
export enum TokenTypeHint {
  AccessToken = 'access_token',
  RefreshToken = 'refresh_token',
  IdToken = 'id_token',
  Sid = 'sid',
  Sso = 'sso'
}

export class GroupAllowed {
  /** Unique group id */
  id: string;
  /** List of grouproles to match */
  roles: string[];
  /** If true, all roles have to be included. If false, only 1 role from the list is needed */
  strictRoleValidation: boolean = false;
}