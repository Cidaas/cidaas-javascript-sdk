export interface GetConsentDetailsRequest {
    consent_id: string;
    consent_version_id: string;
    sub: string;
}

export interface AcceptConsentRequest {
    client_id: string;
    consent_id: string;
    consent_version_id: string;
    
    sub?: string;
    q?: string;
    scopes?: string[];
    url?: string;
    field_key?: string;
    accepted_fields?: string[];
    accepted_by?: string;
    skipped?: boolean;
    action_type?: string;
    action_id?: string;
    revoked?: boolean;
  }