export interface NewAppUser {
  user_id: string;
  first_name: string;
  last_name: string;
  create_user_id: string;
  create_utc_timestamp: Date;
  update_user_id: string;
  update_utc_timestamp: Date;
  auth_user_guid: string;
  office_guid: string | null;
  team_code: string | null;
  park_area_guid: string | null;
  roles: {
    user_roles: Array<{ name: string | undefined }>;
    user_idir: string; //Example : fohe4m5pn8clhkxmlho33sn1r7vr7m67@idir
  };
  coms_enrolled_ind: boolean;
  deactivate_ind: boolean;
  agency_code_ref: string | undefined;
}
