export interface IUserLinkEntity {
  master_sub: string;
  user_name_type: string;
  user_name_to_link: string;
  link_accepted_by: string;
  link_response_time: Date;
  link_accepted: boolean;
  communication_type: string;
  verification_status_id: string;
  type: string;
  status: string;
}