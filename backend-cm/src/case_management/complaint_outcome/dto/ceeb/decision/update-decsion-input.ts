import { DecisionInput } from "./decision-input";

export class UpdateDecisionInput {
  complaintOutcomeGuid: string;
  outcomeAgencyCode: string;
  updateUserId: string;
  decision: DecisionInput;
}
