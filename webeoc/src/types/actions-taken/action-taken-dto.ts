import { UUID } from "crypto";

export interface ActionTakenDto {
  actionTakenId: UUID;
  complaintId?: string;
  complaintUpdateGuid?: UUID;

  webeocId?: string;

  loggedBy: string; //-- action_logged_by -> logged_by_text
  actionTimestamp: Date; //--action_datetime -> action_utc_timestamp
  details: string; //-- action_details -> acton_details_text
  isUpdate: boolean; //-- flag_UAT === "Yes"
}
