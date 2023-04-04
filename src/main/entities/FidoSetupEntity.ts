export interface FidoSetupEntity {
  track_id: string;
  fido_request_type: string;
  mobile_number: string;
  phone: string;
  security_questions: string[];
  verification_type: string;
}