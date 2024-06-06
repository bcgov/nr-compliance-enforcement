import { UUID } from "crypto";
import { CaseAction } from "./case-action";

export interface FileReviewInput {
  caseIdentifier?: UUID;
  leadIdentifier: string;
  userId: string;
  agencyCode: string;
  caseCode: string;
  isReviewRequired: boolean;
  reviewComplete?: CaseAction;
}
