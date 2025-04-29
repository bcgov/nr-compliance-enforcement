import { AssessmentDto } from "./assessment";
export interface UpdateAssessmentInput {
  leadIdentifier: string;
  agencyCode: string;
  caseCode: string;
  updateUserId: string;
  assessment: AssessmentDto;
}
