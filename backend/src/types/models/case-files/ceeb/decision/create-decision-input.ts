import { BaseCaseFileInput } from "../../base-case-file-input";
import { DecisionInput } from "./decision-input";

export interface CreateDecisionInput extends BaseCaseFileInput {
  decison: DecisionInput;
}
