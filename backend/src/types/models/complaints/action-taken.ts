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
  dataId: number;
}

export interface ActionTakenDto {
  actionTakenGuid: string;
  complaintIdentifier?: string;
  complaintUpdateGuid?: string;
  actionDetailsTxt?: string;
  loggedByTxt?: string;
  actionUtcTimestamp?: Date;
}

//{"details": "Action 1 - gir test - edit 1", "isUpdate": false, "loggedBy": "Scarlett Truong", "webeocId": "275908", "complaintId": "24-000558", "actionTakenId": "16ca3bcc-23a8-4930-b0a6-32ab460a702a", "actionTimestamp": "08/12/2024 16:36:52"}
