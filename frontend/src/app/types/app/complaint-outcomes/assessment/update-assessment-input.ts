import { AssessmentDto } from "./assessment";
export interface UpdateAssessmentInput {
  complaintId: string;
  complaintOutcomeGuid: string;
  outcomeAgencyCode: string;
  caseCode: string;
  updateUserId: string;
  assessment: AssessmentDto;
}
