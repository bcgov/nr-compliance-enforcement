import { CaseFileAction } from "../../case_file_action/entities/case_file_action.entity";
import { KeyValuePair } from "./key-value-pair";

export class Assessment {
  id: string;
  caseIdentifier: string;
  agencyCode: string;
  actionNotRequired: boolean;
  actionJustificationCode: string;
  actionJustificationShortDescription: string;
  actionJustificationLongDescription: string;
  actionJustificationActiveIndicator: boolean;
  actions: CaseFileAction[];
  contactedComplainant?: boolean;
  attended?: boolean;
  locationType?: KeyValuePair;
  conflictHistory?: KeyValuePair;
  categoryLevel?: KeyValuePair;
  cat1Actions?: CaseFileAction[];
}
