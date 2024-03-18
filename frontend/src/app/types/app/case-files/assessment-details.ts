import { AssessmentActionDto } from "./assessment-action";
export interface AssessmentDetailsDto {
  actionNotRequired: boolean;
  actionJustificationCode: string;
  actionJustificationShortDescription: string;
  actionJustificationLongDescription: string;
  actionJustificationActiveIndicator: boolean;
  actions: Array<AssessmentActionDto>
}