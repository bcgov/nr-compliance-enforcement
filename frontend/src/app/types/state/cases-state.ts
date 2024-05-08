import { Assessment } from "../outcomes/assessment";
import { EquipmentDetailsDto } from "../app/case-files/equipment-details";
import { Prevention } from "../outcomes/prevention";
import { SupplementalNote } from "../outcomes/supplemental-note";
import { CaseAction } from "../outcomes/case-action";
import { AnimalTagV2 } from "../app/complaints/outcomes/wildlife/animal-tag";
import { DrugUsedV2 } from "../app/complaints/outcomes/wildlife/drug-used";

export interface CasesState {
  caseId: string | undefined;
  assessment: Assessment;
  prevention: Prevention;
  note: SupplementalNote;
  isReviewRequired: boolean;
  reviewComplete?: Review | null;
  equipment: EquipmentDetailsDto[];
  subject: Array<Subject>;
}

export interface Review {
  actor: string;
  date: Date;
  actionCode: string;
  actionId?: string;
}

type Subject = AnimalOutcomeSubject | PersonSubject;

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
  drugs?: Array<DrugUsedV2>;
  actions?: Array<CaseAction>;
}
