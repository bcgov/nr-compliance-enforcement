import { UUID } from "crypto";

export interface PersonComplaintXrefTable {
  active_ind: boolean;
  person_guid: {
    person_guid: UUID;
  };
  complaint_identifier: string;
  person_complaint_xref_code: string;
  create_user_id?: string;
  update_user_id?: string;
}
