import { AssessmentActionDto } from "./assessment-action";
export interface AssessmentDetailsDto { 
    actionNotRequiredInd: boolean;
    inactionReasonCode: string;
    shortDescription: string;
    longDescription: string;
    activeId: boolean;
    assessmentActions: Array<AssessmentActionDto>
}