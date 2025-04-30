import { AssessmentActionDto } from "./assessment-action";
import KeyValuePair from "../../key-value-pair";
export interface AssessmentDto {
  id?: string;
  agencyCode?: string;
  actionNotRequired: boolean;
  actionCloseComplaint: boolean;
  actionLinkedComplaintIdentifier: string;
  actionJustificationCode: string;
  actionJustificationShortDescription?: string;
  actionJustificationLongDescription?: string;
  actionJustificationActiveIndicator?: boolean;
  actions: Array<AssessmentActionDto>;
  contactedComplainant: boolean;
  attended: boolean;
  locationType: KeyValuePair;
  conflictHistory: KeyValuePair;
  categoryLevel: KeyValuePair;
  cat1Actions: Array<AssessmentActionDto>;
}
