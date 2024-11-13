import { Assessment } from "../outcomes/assessment";
import { EquipmentDetailsDto } from "../app/case-files/equipment-details";
import { Prevention } from "../outcomes/prevention";
import { SupplementalNote } from "../outcomes/supplemental-note";
import { CaseAction } from "../outcomes/case-action";
import { AnimalTagV2 } from "../app/complaints/outcomes/wildlife/animal-tag";
import { DrugUsed } from "../app/complaints/outcomes/wildlife/drug-used";
import { Decision } from "../app/case-files/ceeb/decision/decision";
import { PermitSite } from "../app/case-files/ceeb/authorization-outcome/permit-site";

export interface CasesState {
  caseId: string | undefined;
  assessment: Assessment;
  prevention: Prevention;
  note: SupplementalNote;
  isReviewRequired: boolean;
  reviewComplete?: Review | null;
  equipment: EquipmentDetailsDto[];
  subject: Array<Subject>;
  isInEdit: IsInEdit;
  decision?: Decision;
  authorization?: PermitSite;
}

export interface IsInEdit {
  assessment: boolean;
  prevention: boolean;
  equipment: boolean;
  animal: boolean;
  note: boolean;
  attachments: boolean;
  fileReview: boolean;
  showSectionErrors: boolean;
  hideAssessmentErrors: boolean;
  decision: false;
  authorization: false;
}
export interface Review {
  actor: string;
  date: Date;
  actionCode: string;
  actionId?: string;
}

export type Subject = AnimalOutcomeSubject | PersonSubject;

export interface PersonSubject {}

export interface AnimalOutcomeSubject {
  id: string;
  species: string;
  sex?: string;
  age?: string;
  categoryLevel?: string;
  conflictHistory?: string;
  outcome?: string;
  tags?: Array<AnimalTagV2>;
  drugs?: Array<DrugUsed>;
  actions?: Array<CaseAction>;
  order: number;
  identifyingFeatures?: string;
}
