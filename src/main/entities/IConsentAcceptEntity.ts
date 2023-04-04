export interface IConsentAcceptEntity {
    client_id: string;
    consent_id: string;
    consent_version_id: string;
    sub: string;
    scopes: string[];
    url: string;
    matcher: any;
    field_key: string;
    accepted_fields: string[];
    accepted_by: string;
    skipped: boolean;
    action_type: string;
    action_id: string;
    q: string;
    revoked: boolean;
}