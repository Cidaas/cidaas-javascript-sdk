export interface ChangePasswordEntity {
  sub: string;
  identityId: string;
  old_password: string;
  new_password: string;
  confirm_password: string;
  accessToken: string;
}
