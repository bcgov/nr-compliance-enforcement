import { UUID } from "crypto";
import { AssessmentDetailsDto } from "./assessment-details";
import { PreventionEducationDetailsDto } from "./prevention-education-details";

export interface CaseFileDto {
  caseIdentifier: UUID;
  leadIdentifier: string;
  createUserId: string;
  agencyCode: string;
  caseCode: string;
  assessmentDetails: AssessmentDetailsDto
  preventionEducationDetails: PreventionEducationDetailsDto
  updateUserId: string
}
