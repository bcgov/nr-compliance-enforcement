import { UUID } from "node:crypto";
import { PreventionDto } from "./prevention";
export interface UpdatePreventionInput {
  complaintId: string;
  complaintOutcomeGuid: string;
  outcomeAgencyCode: string;
  actor: UUID;
  createUserId: string;
  updateUserId: string;
  prevention: PreventionDto;
}
