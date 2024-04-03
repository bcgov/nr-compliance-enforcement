import { Assessment } from "../outcomes/assessment";
import { EquipmentDetailsDto } from "../app/case-files/equipment-details";

export interface CasesState {
  assessment: Assessment;
  equipment: EquipmentDetailsDto[]
}
