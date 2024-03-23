import { Equipment } from "../outcomes/equipment";
import { Assessment } from "../outcomes/assessment";

export interface CasesState {
  assessment: Assessment;
  equipment: Equipment[]
}
