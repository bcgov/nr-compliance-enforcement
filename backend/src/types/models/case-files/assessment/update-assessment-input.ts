import { BaseCaseFileInput } from "../base-case-file-input";
import { AssessmentDto } from "./assessment";

export interface UpdateAssessmentInput extends BaseCaseFileInput {
  assessment: AssessmentDto;
}
