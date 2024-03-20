import { Assessment } from "../outcomes/assessment";
import { PreventionEducation } from "../outcomes/hwcr-prevention";

export interface CasesState {
  assessment: Assessment;
  preventionEducation: PreventionEducation;
}
