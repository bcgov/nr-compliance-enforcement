import { UUID } from "node:crypto";

export interface BaseComplaintOutcomeCreateInput {
  complaintId: string;
  outcomeAgencyCode: string;
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
