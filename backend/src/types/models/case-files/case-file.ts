import { UUID } from "crypto";
import { AssessmentDetailsDto } from "./assessment-details";

export interface CaseFileDto { 
    caseFileGuid: UUID;
    leadIdentifier: string;
    assessmentDetails: AssessmentDetailsDto
}