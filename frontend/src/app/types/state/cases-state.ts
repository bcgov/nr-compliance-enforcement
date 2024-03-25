import { Assessment } from "../outcomes/assessment";
import { Prevention } from "../outcomes/prevention";

export interface CasesState {
  assessment: Assessment;
  prevention: Prevention;
}
