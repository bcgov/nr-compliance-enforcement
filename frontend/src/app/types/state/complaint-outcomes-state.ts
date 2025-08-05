import { Assessment } from "@apptypes/outcomes/assessment";
import { EquipmentDetailsDto } from "@/app/types/app/complaint-outcomes/equipment-details";
import { Prevention } from "@apptypes/outcomes/prevention";
import { Note } from "@/app/types/outcomes/note";
import { CaseAction } from "@apptypes/outcomes/case-action";
import { AnimalTagV2 } from "@apptypes/app/complaints/outcomes/wildlife/animal-tag";
import { DrugUsed } from "@apptypes/app/complaints/outcomes/wildlife/drug-used";
import { Decision } from "@/app/types/app/complaint-outcomes/ceeb/decision/decision";
import { PermitSite } from "@/app/types/app/complaint-outcomes/ceeb/authorization-outcome/permit-site";

export interface ComplaintOutcomesState {
  complaintOutcomeGuid: string | undefined;
  assessments: Assessment[];
  preventions: Prevention[];
  notes: Note[];
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
  notes: boolean;
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
  outcomeActionedBy?: string;
  tags?: Array<AnimalTagV2>;
  drugs?: Array<DrugUsed>;
  actions?: Array<CaseAction>;
  order: number;
  identifyingFeatures?: string;
}
