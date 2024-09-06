import { BaseCaseFileInput } from "../../base-case-file-input";
import { DecisionInput } from "./decision-input";

export interface UpdateDecisionInput extends BaseCaseFileInput {
  agencyCode: string;
  caseCode: string;
  decison: DecisionInput;
}
