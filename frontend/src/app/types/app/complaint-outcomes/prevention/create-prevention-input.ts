import { UUID } from "crypto";
import { PreventionDto } from "./prevention";
export interface CreatePreventionInput {
  complaintId: string;
  complaintOutcomeGuid?: string;
  outcomeAgencyCode: string;
  caseCode: string;
  actor: UUID;
  createUserId: string;
  updateUserId: string;
  prevention: PreventionDto;
}
