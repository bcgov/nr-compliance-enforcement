import { UUID } from "crypto";
import { AssessmentDetailsDto } from "./assessment-details";
import { ReviewCompleteAction } from "./review-complete-action";
import { PreventionDetailsDto } from "./prevention/prevention-details";
import { EquipmentDetailsDto } from "./equipment-details";
import { Subject } from "../../state/cases-state";

export interface CaseFileDto {
  caseIdentifier: UUID;
  leadIdentifier: string;
  createUserId: string;
  agencyCode: string;
  caseCode: string;
  assessmentDetails: AssessmentDetailsDto;
  preventionDetails: PreventionDetailsDto;
  updateUserId: string;
  isReviewRequired: boolean;
  reviewComplete?: ReviewCompleteAction;
  equipment: EquipmentDetailsDto[];
  subject: Array<Subject>;
}
