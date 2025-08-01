import { BaseComplaintOutcomeInput } from "../../base-complaint-outcome-input";
import { DecisionDto } from "./decision-input";

export interface UpdateDecisionInput extends BaseComplaintOutcomeInput {
  outcomeAgencyCode: string;
  caseCode: string;
  decison: DecisionDto;
}
