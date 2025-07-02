import { AssessmentInput } from "./assessment.input";
import { CreateEquipmentDetailsInput } from "./equipment/create-equipment-details.input";
import { PreventionInput } from "./prevention.input";

export class CreateCaseInput {
  leadIdentifier: string;
  equipment?: [CreateEquipmentDetailsInput];
  agencyCode: string;
  caseCode: string;
  createUserId: string;
}
export class CreateAssessmentInput {
  leadIdentifier: string;
  caseIdentifier: string;
  assessment: AssessmentInput;
  agencyCode: string;
  caseCode: string;
  createUserId: string;
}

export class CreatePreventionInput {
  leadIdentifier: string;
  caseIdentifier: string;
  prevention: PreventionInput;
  agencyCode: string;
  caseCode: string;
  createUserId: string;
}

export class CreateEquipmentInput {
  leadIdentifier: string;
  equipment: [CreateEquipmentDetailsInput];
  agencyCode: string;
  caseCode: string;
  createUserId: string;
}
