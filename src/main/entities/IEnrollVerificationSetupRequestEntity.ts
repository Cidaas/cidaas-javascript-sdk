
export interface IEnrollVerificationSetupRequestEntity {
  exchange_id: string;
  device_id: string;
  finger_print: string;
  client_id: string;
  push_id: string;
  pass_code: string;
  pkce_key: string;


  face_attempt: number;
  attempt: number;

  fido2_client_response: FIDO2EnrollEntity;

  //additional params
  verification_type: string;
}

interface FIDO2EnrollEntity {
  client_response: any;
  fidoRequestId: string;
}