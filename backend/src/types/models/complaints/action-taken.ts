import { UUID } from "node:crypto";

export interface ActionTaken {
  actionTakenId: UUID;
  complaintId?: string;
  complaintUpdateGuid?: UUID;
  webeocId?: string; //-- used to lookup complaint_id
  loggedBy: string; //--> logged_by_text
  actionTimestamp: Date; //--> action_utc_timestamp
  details: string; //--> acton_details_text
  isUpdate: boolean; //-- flag_UAT === "Yes"
  dataid: number;
}

export interface ActionTakenDto {
  actionTakenGuid: string;
  complaintIdentifier?: string;
  complaintUpdateGuid?: string;
  actionDetailsTxt?: string;
  loggedByTxt?: string;
  actionUtcTimestamp?: Date;
}
