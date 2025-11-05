import { UUID } from "node:crypto";
import { PreventionDto } from "./prevention";
export interface CreatePreventionInput {
  complaintId: string;
  complaintOutcomeGuid?: string;
  outcomeAgencyCode: string;
  actor: UUID;
  createUserId: string;
  updateUserId: string;
  prevention: PreventionDto;
}
