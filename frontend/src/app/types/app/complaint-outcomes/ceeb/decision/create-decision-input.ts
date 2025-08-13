import { BaseComplaintOutcomeCreateInput } from "@/app/types/app/complaint-outcomes/base-case-file-input";
import { Decision } from "./decision";

export interface CreateDecisionInput extends BaseComplaintOutcomeCreateInput {
  decision: Decision;
}
