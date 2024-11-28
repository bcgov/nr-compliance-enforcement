import { BaseCaseFileUpdateInput } from "@apptypes/app/case-files/base-case-file-input";
import { Decision } from "./decision";

export interface UpdateDecisionInput extends BaseCaseFileUpdateInput {
  agencyCode: string;
  caseCode: string;
  decision: Decision;
}
