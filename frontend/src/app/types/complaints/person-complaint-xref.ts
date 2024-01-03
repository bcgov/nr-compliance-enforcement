export interface PersonComplaintXref {
  personComplaintXrefGuid?: string;
  create_user_id: string;
  update_user_id: string;
  active_ind: boolean;
  complaint_identifier: string;
  person_complaint_xref_code: string;
  person_guid: {
    person_guid: string;
    person_complaint_xref_guid: string;
    first_name: string;
    last_name: string;
    middle_name_1: string;
    middle_name_2: string
  };
}
