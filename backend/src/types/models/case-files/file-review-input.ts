import { UUID } from "node:crypto";
import { CaseAction } from "./case-action";

export interface FileReviewInput {
  complaintOutcomeGuid?: UUID;
  complaintId: string;
  userId: string;
  outcomeAgencyCode: string;
  isReviewRequired: boolean;
  reviewComplete?: CaseAction;
}
