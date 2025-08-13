import { AssessmentDto } from "./assessment";
export interface UpdateAssessmentInput {
  complaintId: string;
  complaintOutcomeGuid: string;
  outcomeAgencyCode: string;
  updateUserId: string;
  assessment: AssessmentDto;
}
