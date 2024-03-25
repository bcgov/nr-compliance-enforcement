import { UUID } from "crypto";
import { AssessmentDetailsDto } from "./assessment-details";
import { Note } from "./supplemental-notes/note";

export interface CaseFileDto {
    caseIdentifier: UUID;
    leadIdentifier: string;
    createUserId: string;
    agencyCode: string;
    caseCode: string;
    assessmentDetails: AssessmentDetailsDto
    updateUserId: string
    note?: Note
}