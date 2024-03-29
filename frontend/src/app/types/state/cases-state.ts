import { Assessment } from "../outcomes/assessment";

export interface CasesState {
  caseId: string | undefined;
  assessment: Assessment;
  isReviewRequired: boolean;
  reviewComplete?: {
    actor: string
    date: Date
    actionCode: string
    actionId?: string
  } | undefined | null
}
