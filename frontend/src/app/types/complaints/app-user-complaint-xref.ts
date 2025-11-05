export interface AppUserComplaintXref {
  appUserComplaintXrefGuid?: string; // Renamed from personComplaintXrefGuid
  create_user_id: string;
  update_user_id: string;
  active_ind: boolean;
  complaint_identifier: string;
  app_user_complaint_xref_code: string;
  app_user_guid: string;
  first_name: string;
  last_name: string;
}
