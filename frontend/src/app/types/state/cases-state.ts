import { Assessment } from "../outcomes/assessment";
import { Prevention } from "../outcomes/prevention";
import { SupplementalNote } from "../outcomes/supplemental-note";

export interface CasesState {
  assessment: Assessment;
  prevention: Prevention;
  note: SupplementalNote
}
