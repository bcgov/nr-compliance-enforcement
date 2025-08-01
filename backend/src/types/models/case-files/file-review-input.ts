import { UUID } from "crypto";
import { CaseAction } from "./case-action";

export interface FileReviewInput {
  complaintOutcomeGuid?: UUID;
  complaintId: string;
  userId: string;
  outcomeAgencyCode: string;
  caseCode: string;
  isReviewRequired: boolean;
  reviewComplete?: CaseAction;
}
