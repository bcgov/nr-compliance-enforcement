export interface NewPersonComplaintXref {
  active_ind: true;
  person_guid: {
    person_guid: string;
  };
  complaint_identifier: string;
  person_complaint_xref_code: string;
  create_user_id: string;
}
