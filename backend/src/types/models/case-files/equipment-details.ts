import { AssessmentActionDto } from "./assessment-action";
export interface EquipmentDetailsDto { 
    actionEquipmentTypeCode: string;
    actionEquipmentTypeActiveIndicator: boolean;
    address: string;
    xCoordinate: string;
    yCoordinate: string;
    actions: Array<AssessmentActionDto>;
}