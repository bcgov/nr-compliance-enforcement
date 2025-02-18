import { UUID } from "crypto";
import { AssessmentDetailsDto } from "./assessment-details";
import { EquipmentDetailsDto } from "./equipment/equipment-details";
import { Note } from "./notes/note";
import { PreventionDetailsDto } from "./prevention-details";
import { FileReviewActionDto } from "./file-review-action";
import { PermitSiteDto } from "./ceeb/site/permit-site-input";
import { DecisionDto } from "./ceeb/decision/decision-input";

export interface CaseFileDto {
  caseIdentifier: UUID;
  leadIdentifier: string;
  createUserId: string;
  agencyCode: string;
  caseCode: string;
  assessmentDetails?: AssessmentDetailsDto;
  preventionDetails?: PreventionDetailsDto;
  equipment: Array<EquipmentDetailsDto>;
  updateUserId: string;
  isReviewRequired: boolean;
  reviewComplete: FileReviewActionDto;
  notes: Note[];
  authorization?: PermitSiteDto;
  decision?: DecisionDto;
}
