import { AssessmentDto } from "./assessment";
export interface UpdateAssessmentInput {
  caseIdentifier: string;
  agencyCode: string;
  caseCode: string;
  updateUserId: string;
  assessment: AssessmentDto;
}
