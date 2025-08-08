import { BaseComplaintOutcomeInput } from "../base-complaint-outcome-input";
import { AssessmentDto } from "./assessment";

export interface CreateAssessmentInput extends BaseComplaintOutcomeInput {
  assessment: AssessmentDto;
}
