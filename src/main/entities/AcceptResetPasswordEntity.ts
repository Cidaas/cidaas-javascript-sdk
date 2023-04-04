export class AcceptResetPasswordEntity {
  resetRequestId: string = "";
  exchangeId: string = "";
  password: string = "";
  confirmPassword: string = "";
  provider: string = "";
  requestId: string = "";
}