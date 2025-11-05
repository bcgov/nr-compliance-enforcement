import { UUID } from "node:crypto";

export interface AppUserComplaintXrefTable {
  active_ind: boolean;
  app_user_guid: UUID;
  complaint_identifier: string;
  app_user_complaint_xref_code: string;
  create_user_id: string;
  create_utc_timestamp: Date;
  update_user_id: string;
  update_utc_timestamp: Date;
}
