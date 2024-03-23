import { Assessment } from "../outcomes/assessment";

export interface CasesState {
  assessment: Assessment;
  notes?: string
}
