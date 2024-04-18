import { CaseActionDto } from "./case-action";

export interface EquipmentDetailsDto {
  equipmentGuid?: string;
  equipmentTypeCode: string;
  equipmentTypeShortDescription?: string;
  equipmentTypeLongDescription?: string;
  equipmentTypeActiveIndicator: boolean;
  address?: string;
  xCoordinate: string;
  yCoordinate: string;
  actions?: Array<CaseActionDto>
}