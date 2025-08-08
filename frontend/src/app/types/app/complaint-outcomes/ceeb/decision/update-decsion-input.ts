import { BaseComplaintOutcomeUpdateInput } from "@/app/types/app/complaint-outcomes/base-case-file-input";
import { Decision } from "./decision";

export interface UpdateDecisionInput extends BaseComplaintOutcomeUpdateInput {
  outcomeAgencyCode: string;
  decision: Decision;
}
