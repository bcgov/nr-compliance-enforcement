import { AssessmentDto } from "./assessment";
export interface UpdateAssessmentInput {
  leadIdentifier: string;
  caseIdentifier: string;
  agencyCode: string;
  caseCode: string;
  updateUserId: string;
  assessment: AssessmentDto;
}
