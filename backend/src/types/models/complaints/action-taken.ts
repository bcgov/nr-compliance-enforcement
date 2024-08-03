import { UUID } from "crypto";

export interface ActionTaken {
  actionTakenId: UUID;
  complaintId?: string;
  complaintUpdateGuid?: UUID;
  webeocId?: string; //-- used to lookup complaint_id
  loggedBy: string; //--> logged_by_text
  actionTimestamp: Date; //--> action_utc_timestamp
  details: string; //--> acton_details_text
  isUpdate: boolean; //-- flag_UAT === "Yes"
}
