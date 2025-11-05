import { UUID } from "node:crypto";

export interface ActionTaken {
  actionTakenGuid: UUID;
  complaintUpdateGuid?: UUID;
  complaintId?: string;
  actionDetailsTxt: string;
  loggedByTxt: string;
  actionUtcTimestamp: string;
  webeocId?: string;
  isUpdate: boolean;
}
