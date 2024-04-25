import { UUID } from "crypto";
import { AssessmentDetailsDto } from "./assessment-details";
import { EquipmentDetailsDto } from "./equipment/equipment-details";
import { Note } from "./supplemental-notes/note";
import { PreventionDetailsDto } from "./prevention-details";

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
  note?: Note;
}
