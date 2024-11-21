import { UUID } from "crypto";
import { AssessmentDetailsDto } from "./assessment-details";
import { ReviewCompleteAction } from "./review-complete-action";
import { PreventionDetailsDto } from "./prevention/prevention-details";
import { EquipmentDetailsDto } from "./equipment-details";
import { Subject } from "@apptypes/state/cases-state";
import { PermitSite } from "./ceeb/authorization-outcome/permit-site";
import { Decision } from "./ceeb/decision/decision";

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
  decision: Decision;
  authorization: PermitSite;
}
