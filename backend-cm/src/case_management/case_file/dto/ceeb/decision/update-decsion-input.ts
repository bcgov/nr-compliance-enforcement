import { DecisionInput } from "./decision-input";

export class UpdateDecisionInput {
  caseIdentifier: string;
  agencyCode: string;
  caseCode: string;
  updateUserId: string;
  decision: DecisionInput;
}
