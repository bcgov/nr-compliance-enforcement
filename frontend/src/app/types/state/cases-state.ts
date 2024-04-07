import { Assessment } from "../outcomes/assessment";
import { EquipmentDetailsDto } from "../app/case-files/equipment-details";
import { Prevention } from "../outcomes/prevention";
import { SupplementalNote } from "../outcomes/supplemental-note";

export interface CasesState {
  caseId: string | undefined;
  assessment: Assessment;
  prevention: Prevention;
  note: SupplementalNote;
  isReviewRequired: boolean;
  reviewComplete?: {
    actor: string
    date: Date
    actionCode: string
    actionId?: string
  } | null;
  equipment: EquipmentDetailsDto[];
}
