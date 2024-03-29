import { UUID } from "crypto";
import { AssessmentDetailsDto } from "./assessment-details";

export interface CaseFileDto {
    caseIdentifier: UUID;
    leadIdentifier: string;
    createUserId: string;
    agencyCode: string;
    caseCode: string;
    assessmentDetails: AssessmentDetailsDto
    updateUserId: string;
    isReviewRequired: boolean;
}