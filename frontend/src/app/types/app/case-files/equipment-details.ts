import { CaseActionDto } from "./case-action";

export interface EquipmentDetailsDto {
  actionEquipmentTypeCode: string;
  actionEquipmentTypeShortDescription?: string;
  actionEquipmentTypeLongDescription?: string;
  actionEquipmentTypeActiveIndicator: boolean;
  address?: string;
  xCoordinate: string;
  yCoordinate: string;
  actions?: Array<CaseActionDto>
}