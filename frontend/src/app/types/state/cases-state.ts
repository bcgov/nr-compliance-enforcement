import { Assessment } from "../outcomes/assessment";
import { Prevention } from "../outcomes/prevention";

export interface CasesState {
  caseId: string | undefined;
  assessment: Assessment;
  prevention: Prevention;
  isReviewRequired: boolean;
  reviewComplete?: {
    actor: string
    date: Date
    actionCode: string
    actionId?: string
  } | null
}
