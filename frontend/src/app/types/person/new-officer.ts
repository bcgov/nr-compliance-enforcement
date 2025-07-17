export interface NewOfficer {
  user_id: string;
  create_user_id: string;
  create_utc_timestamp: Date;
  update_user_id: string;
  update_utc_timestamp: Date;
  auth_user_guid: string;
  office_guid: string | null;
  team_code: string | null;
  park_area_guid: string | null;
  person_guid: {
    first_name: string;
    middle_name_1: null;
    middle_name_2: null;
    last_name: string;
    create_user_id: string;
    create_utc_timestamp: Date;
    update_user_id: string;
    updateTimestamp: Date;
  };
  roles: {
    user_roles: Array<{ name: string | undefined }>;
    user_idir: string; //Example : fohe4m5pn8clhkxmlho33sn1r7vr7m67@idir
  };
  coms_enrolled_ind: boolean;
  deactivate_ind: boolean;
  agency_code_ref: string | undefined;
}
