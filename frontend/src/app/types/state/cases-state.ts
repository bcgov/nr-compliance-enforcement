import { Assessment } from "../outcomes/assessment";
import { EquipmentDetailsDto } from "../app/case-files/equipment-details";
import { Prevention } from "../outcomes/prevention";
export interface CasesState {
  assessment: Assessment;
  equipment: EquipmentDetailsDto[]
  prevention: Prevention;
}
