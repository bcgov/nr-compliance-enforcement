import { UUID } from "crypto";
import { AssessmentDto } from "./assessment/assessment";
import { EquipmentDetailsDto } from "./equipment/equipment-details";
import { Note } from "./notes/note";
import { PreventionDto } from "./prevention/prevention";
import { FileReviewActionDto } from "./file-review-action";
import { PermitSiteDto } from "./ceeb/site/permit-site-input";
import { DecisionDto } from "./ceeb/decision/decision-input";

export interface CaseFileDto {
  caseIdentifier: UUID;
  leadIdentifier: string;
  createUserId: string;
  agencyCode: string;
  caseCode: string;
  assessment?: AssessmentDto[];
  prevention?: PreventionDto[];
  equipment: EquipmentDetailsDto[];
  updateUserId: string;
  isReviewRequired: boolean;
  reviewComplete: FileReviewActionDto;
  notes: Note[];
  authorization?: PermitSiteDto;
  decision?: DecisionDto;
}
