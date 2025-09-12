import { DecisionInput } from "./decision-input";

export class CreateDecisionInput {
  complaintId: string;
  outcomeAgencyCode: string;
  createUserId: string;
  decision: DecisionInput;
}
