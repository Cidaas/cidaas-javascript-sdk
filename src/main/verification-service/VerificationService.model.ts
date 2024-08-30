export interface InitiateAccountVerificationRequest {
    email?: string;
    mobile?: string;
    phone?: string;
    username?: string;
    verificationMedium?: string;
    processingType?: string;
    requestId?: string;
    client_id?: string;
    redirect_uri?: string;
    response_type?: string;
    sub: string;
    templateKey?: string;
    name?: string;
    accept_language?: string;
  }

export interface VerifyAccountRequest {
    accvid: string;
    code: string;
}