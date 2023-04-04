export interface ResetPasswordEntity {
  email: string;
  mobile: string;
  phone: string;
  username: string;
  resetMedium: string;
  processingType: string;
  requestId: string;
  provider: string;
  resetPasswordId: string;
  sub: string;
}