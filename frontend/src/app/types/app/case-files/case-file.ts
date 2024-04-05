import { UUID } from "crypto";
import { AssessmentDetailsDto } from "./assessment-details";
import { EquipmentDetailsDto } from "./equipment-details";
import { ReviewCompleteAction } from "./review-complete-action";
import { PreventionDetailsDto } from "./prevention/prevention-details";

export interface CaseFileDto {
  caseIdentifier: UUID;
  leadIdentifier: string;
  createUserId: string;
  agencyCode: string;
  caseCode: string;
  assessmentDetails: AssessmentDetailsDto;
  equipmentDetails: EquipmentDetailsDto[];
  preventionDetails: PreventionDetailsDto
  updateUserId: string
  isReviewRequired: boolean;
  reviewComplete?: ReviewCompleteAction
}
