import { BaseComplaintOutcomeInput } from "../../base-complaint-outcome-input";
import { DecisionDto } from "./decision-input";

export interface CreateDecisionInput extends BaseComplaintOutcomeInput {
  decison: DecisionDto;
}
