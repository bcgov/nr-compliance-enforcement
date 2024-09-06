import { BaseCaseFileCreateInput } from "../../base-case-file-input";
import { Decision } from "./decision";

export interface CreateDecisionInput extends BaseCaseFileCreateInput {
  decision: Decision;
}
