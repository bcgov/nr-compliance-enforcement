import { UUID } from "crypto";
import { PreventionDto } from "./prevention";
export interface CreatePreventionInput {
  leadIdentifier: string;
  caseIdentifier?: string;
  agencyCode: string;
  caseCode: string;
  actor: UUID;
  createUserId: string;
  updateUserId: string;
  prevention: PreventionDto;
}
