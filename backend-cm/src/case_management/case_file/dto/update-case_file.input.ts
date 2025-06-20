import { AssessmentInput } from "./assessment.input";
import { UpdateEquipmentDetailsInput } from "./equipment/update-equipment-details.input";
import { PreventionInput } from "./prevention.input";

export class UpdateAssessmentInput {
  caseIdentifier: string;
  leadIdentifier: string;
  assessment: AssessmentInput;
  agencyCode: string;
  caseCode: string;
  updateUserId: string;
}

export class UpdatePreventionInput {
  caseIdentifier: string;
  leadIdentifier: string;
  prevention: PreventionInput;
  agencyCode: string;
  caseCode: string;
  updateUserId: string;
}

export class UpdateEquipmentInput {
  caseIdentifier: string;
  leadIdentifier: string;
  equipment: [UpdateEquipmentDetailsInput];
  updateUserId: string;
}
