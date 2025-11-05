import { UUID } from "node:crypto";

export interface BaseComplaintOutcomeInput {
  complaintOutcomeGuid: UUID;
  complaintId: string;

  outcomeAgencyCode: string;

  actor: UUID;

  createUserId: string;
  updateUserId: string;

  actionId?: string;
}
