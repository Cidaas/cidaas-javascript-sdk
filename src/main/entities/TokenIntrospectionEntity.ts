export class TokenIntrospectionEntity {
  token: string = "";
  token_type_hint?: string;
  roles?: string[];
  scopes?: string[];



  groups?: GroupValidationEntity[];
  strictGroupValidation: boolean = false;
  strictScopeValidation: boolean = false;

  strictRoleValidation: boolean = false;
  strictValidation: boolean = false;

  client_id?: string;
  client_secret?: string;

  request_url?: string;
  request_time?: number;
  request_headers?: any;


}
export class GroupValidationEntity {
  groupId?: string;
  groupType?: string;
  roles?: string[];
  strictRoleValidation: boolean = false;
  strictValidation: boolean = false;
}