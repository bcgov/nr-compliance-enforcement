import { UUID } from "crypto";
import { AssessmentDto } from "./assessment";
export interface CreateAssessmentInput {
  leadIdentifier: string;
  agencyCode: string;
  caseCode: string;
  actor: UUID;
  createUserId: string;
  updateUserId: string;
  assessment: AssessmentDto;
}
