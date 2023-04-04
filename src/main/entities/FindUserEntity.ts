export class FindUserEntity {
  sub: string = "";
  email: string = "";
  mobile: string = "";
  username: string = "";
  customFields: any;
  provider: string = "";
  providerUserId: string = "";

  sub_not: string = "";

  //additional param
  requestId: string
}