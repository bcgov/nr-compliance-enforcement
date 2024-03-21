import { Equipment } from "../outcomes/Equipment";
import { Assessment } from "../outcomes/assessment";

export interface CasesState {
  assessment: Assessment;
  equipment: Equipment[]
}
