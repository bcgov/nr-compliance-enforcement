import { BaseCaseFileInput } from "../../base-case-file-input";
import { DecisionDto } from "./decision-input";

export interface UpdateDecisionInput extends BaseCaseFileInput {
  agencyCode: string;
  caseCode: string;
  decison: DecisionDto;
}
