import { BaseCaseFileInput } from "../../base-case-file-input";
import { DecisionDto } from "./decision-input";

export interface CreateDecisionInput extends BaseCaseFileInput {
  decison: DecisionDto;
}
