export interface GetConsentDetailsRequest {
    /** Unique identifier for consent to be accepted */
    consent_id: string;
    /** Unique identifier for version of the consent to be accepted */
    consent_version_id: string;
    /** 
     * Masked sub (id of user), who will accept the consent. 
     * Either sub or q have to be provided, depends on what is given from the query parameter. 
     */
    sub?: string;
    /** 
     * Masked sub (id of user), who will accept the consent. 
     * Either sub or q have to be provided, depends on what is given from the query parameter. 
     */
    q?: string;
}

export interface AcceptConsentRequest {
    /** Unique identifier of client app, can be found in app setting under admin ui */
    client_id: string;
    /** Unique identifier for consent to be accepted */
    consent_id: string;
    /** Unique identifier for version of the consent to be accepted */
    consent_version_id: string;
    /** 
     * Masked sub (id of user), who will accept the consent. 
     * Either sub or q have to be provided, depends on what is given from the query parameter. 
     */
    sub?: string;
    /** 
     * Masked sub (id of user), who will accept the consent. 
     * Either sub or q have to be provided, depends on what is given from the query parameter. 
     */
    q?: string;
    /** Scopes are list of functional definition. Required to be passed on scope consent (Ex: email, profile, openid) */
    scopes?: string[];
    /** Consent url for user to accept terms or privacy policy */
    url?: string;
    /** Unique name of field. Required to be passed when consent is field consent */
    field_key?: string;
    /** List of field_keys which has been accepted */
    accepted_fields?: string[];
    /** Sub of user, which will accept the consent */
    accepted_by?: string;
    /** True if consent is optional and not accepted in consent accept page */
    skipped?: boolean;
    /** Describe how the consent acceptance is triggered. E.g. "register", "login" */
    action_type?: string;
    /** Unique identifier for action, which trigger consent acceptance */
    action_id?: string;
    /** True, if consent has been revoked */
    revoked?: boolean;
  }

  export interface GetConsentVersionDetailsRequest {
    /** Unique identifier for requested consent */
    consentid: string;
    /** Response language, which is configured in cidaas admin ui */
    locale?: string;
    /** DEPRECATED: Access Token is not needed for Getting ConsentVersionDetailsRequest in the current cidaas service. It will be removed in the next Major release */
    access_token?: string;
  }

  export interface AcceptScopeConsentRequest {
    /** Unique identifier of client app, can be found in app setting under admin ui */
    client_id: string;
    /** List of scopes, which is included in the scope consent to be accepted */
    scopes: string[];
    /** 
     * Masked sub (id of user), who will accept the consent. 
     * Either sub or q have to be provided, depends on what is given from the query parameter. 
     */
    sub?: string;
    /** 
     * Masked sub (id of user), who will accept the consent. 
     * Either sub or q have to be provided, depends on what is given from the query parameter. 
     */
    q?: string;
  }

  export interface AcceptClaimConsentRequest {
    /** Unique identifier of client app, can be found in app setting under admin ui */
    client_id: string;
    /** List of claims, which is included in the claim consent to be accepted */
    accepted_claims: string[];
    /** 
     * Masked sub (id of user), who will accept the consent. 
     * Either sub or q have to be provided, depends on what is given from the query parameter. 
     */
    sub?: string;
    /** 
     * Masked sub (id of user), who will accept the consent. 
     * Either sub or q have to be provided, depends on what is given from the query parameter. 
     */
    q?: string;
  }
  
  export interface RevokeClaimConsentRequest {
    /** Unique identifier of client app, can be found in app setting under admin ui */
    client_id: string;
    /** sub (id of user), who will revoke the consent */
    sub: string;
    /** List of claims, which is included in the claim consent to be revoked */
    revoked_claims: string[];
    /** Access token needed to authorized api call. If not provided, access token from UserStorage will be used. */
    access_token?: string;
  }