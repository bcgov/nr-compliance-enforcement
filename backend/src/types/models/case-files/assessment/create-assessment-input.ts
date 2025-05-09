import { BaseCaseFileInput } from "../base-case-file-input";
import { AssessmentDto } from "./assessment";

export interface CreateAssessmentInput extends BaseCaseFileInput {
  assessment: AssessmentDto;
}
