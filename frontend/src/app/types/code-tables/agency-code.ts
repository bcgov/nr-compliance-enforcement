export interface AgencyCode {
  agency_code: string;
  short_description: string;
  long_description: string;
  display_order: number;
  active_ind: boolean;
  create_user_id: string;
  create_user_guid: string | null;
  create_timestamp: string;
  update_user_id: string;
  update_user_guid: string | null;
  update_timestamp: string;
}
