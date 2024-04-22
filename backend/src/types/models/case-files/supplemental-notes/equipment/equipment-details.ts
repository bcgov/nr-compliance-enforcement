import { AssessmentActionDto } from "../../assessment-action";
export interface EquipmentDetailsDto { 
    equipmentTypeCode: string;
    equipmentTypeShortDescription;
    equipmentTypeLongDescription;
    equipmentTypeActiveIndicator: boolean;
    address: string;
    xCoordinate: string;
    yCoordinate: string;
    actions: Array<AssessmentActionDto>;
}