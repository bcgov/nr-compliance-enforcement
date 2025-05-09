import { AssessmentActionDto } from "../assessment/assessment-action";
export interface EquipmentDetailsDto {
  typeCode: string;
  typeShortDescription;
  typeLongDescription;
  activeIndicator: boolean;
  address: string;
  xCoordinate: string;
  yCoordinate: string;
  actions: Array<AssessmentActionDto>;
  wasAnimalCaptured: string;
  quantity?: number;
}
