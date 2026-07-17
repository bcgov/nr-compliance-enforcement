import { AssessmentActionDto } from "./assessment-action";
export interface AssessmentDto {
  id: string;
  outcomeAgencyCode: string;
  contactedComplainant: boolean;
  attended: boolean;
  actionNotRequired: boolean;
  actionCloseComplaint: boolean;
  actionLinkedComplaintIdentifier: string;
  actionJustificationCode: string;
  actionJustificationShortDescription: string;
  actionJustificationLongDescription: string;
  actionJustificationActiveIndicator: boolean;
  actions: Array<AssessmentActionDto>;
}
