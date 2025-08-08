import { BaseComplaintOutcomeInput } from "../base-complaint-outcome-input";
import { AssessmentDto } from "./assessment";

export interface UpdateAssessmentInput extends BaseComplaintOutcomeInput {
  assessment: AssessmentDto;
}
