import { UUID } from "crypto";
import { AssessmentDetailsDto } from "./assessment-details";
import { Note } from "./supplemental-notes/note";
import { PreventionDetailsDto } from "./prevention-details";

export interface CaseFileDto {
    caseIdentifier: UUID;
    leadIdentifier: string;
    createUserId: string;
    agencyCode: string;
    caseCode: string;
    assessmentDetails?: AssessmentDetailsDto
    preventionDetails?: PreventionDetailsDto
    updateUserId: string
    note?: Note
}