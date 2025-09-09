import { AssessmentInput } from "./assessment.input";
import { UpdateEquipmentDetailsInput } from "./equipment/update-equipment-details.input";
import { PreventionInput } from "./prevention.input";

export class UpdateAssessmentInput {
  complaintOutcomeGuid: string;
  complaintId: string;
  assessment: AssessmentInput;
  outcomeAgencyCode: string;
  updateUserId: string;
}

export class UpdatePreventionInput {
  complaintOutcomeGuid: string;
  complaintId: string;
  prevention: PreventionInput;
  outcomeAgencyCode: string;
  updateUserId: string;
}

export class UpdateEquipmentInput {
  complaintOutcomeGuid: string;
  complaintId: string;
  equipment: [UpdateEquipmentDetailsInput];
  updateUserId: string;
}
