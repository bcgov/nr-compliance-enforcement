import { AssessmentInput } from "./assessment.input";
import { CreateEquipmentDetailsInput } from "./equipment/create-equipment-details.input";
import { PreventionInput } from "./prevention.input";

export class CreateComplaintOutcomeInput {
  complaintId: string;
  equipment?: [CreateEquipmentDetailsInput];
  outcomeAgencyCode: string;
  createUserId: string;
  reviewRequired?: boolean;
}
export class CreateAssessmentInput {
  complaintId: string;
  complaintOutcomeGuid: string;
  assessment: AssessmentInput;
  outcomeAgencyCode: string;
  createUserId: string;
}

export class CreatePreventionInput {
  complaintId: string;
  complaintOutcomeGuid: string;
  prevention: PreventionInput;
  outcomeAgencyCode: string;
  createUserId: string;
}

export class CreateEquipmentInput {
  complaintId: string;
  equipment: [CreateEquipmentDetailsInput];
  outcomeAgencyCode: string;
  createUserId: string;
}
