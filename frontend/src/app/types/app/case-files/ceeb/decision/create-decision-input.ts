import { BaseCaseFileCreateInput } from "@apptypes/app/case-files/base-case-file-input";
import { Decision } from "./decision";

export interface CreateDecisionInput extends BaseCaseFileCreateInput {
  decision: Decision;
}
