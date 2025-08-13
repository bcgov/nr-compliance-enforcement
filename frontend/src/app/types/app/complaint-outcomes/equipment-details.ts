import { CaseActionDto } from "./case-action";

export interface EquipmentDetailsDto {
  id?: string;
  typeCode: string;
  shortDescription: string;
  longDescription: string;
  activeIndicator: boolean;
  address?: string;
  xCoordinate: string;
  yCoordinate: string;
  actions?: Array<CaseActionDto>;
  wasAnimalCaptured: string;
  quantity?: number;
}
