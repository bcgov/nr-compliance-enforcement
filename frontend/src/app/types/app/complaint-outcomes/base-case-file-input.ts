import { UUID } from "crypto";

export interface BaseComplaintOutcomeCreateInput {
  complaintId: string;
  outcomeAgencyCode: string;
  caseCode: string;
  actor?: string;
  createUserId: string;
}

export interface BaseComplaintOutcomeUpdateInput {
  complaintOutcomeGuid: UUID | string;
  complaintId: string;
  actor?: string;
  updateUserId: string;
  actionId?: string;
}
