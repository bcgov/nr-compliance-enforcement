import { UUID } from "node:crypto";
import { AssessmentDto } from "./assessment";
export interface CreateAssessmentInput {
  complaintId: string;
  complaintOutcomeGuid?: string;
  outcomeAgencyCode: string;
  actor: UUID;
  createUserId: string;
  updateUserId: string;
  assessment: AssessmentDto;
}
