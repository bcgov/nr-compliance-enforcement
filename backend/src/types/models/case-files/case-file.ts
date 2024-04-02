import { UUID } from "crypto";
import { AssessmentDetailsDto } from "./assessment-details";
import { EquipmentDetailsDto } from "./equipment-details";

export interface CaseFileDto {
    caseIdentifier: UUID;
    leadIdentifier: string;
    createUserId: string;
    agencyCode: string;
    caseCode: string;
    assessmentDetails: AssessmentDetailsDto;
    equipmentDetails: Array<EquipmentDetailsDto>;
    updateUserId: string
}