import { UUID } from "node:crypto";
import { ReviewCompleteAction } from "./review-complete-action";

export interface ReviewInput {
  complaintOutcomeGuid?: UUID;
  complaintId: string;
  userId: string;
  outcomeAgencyCode: string;
  isReviewRequired: boolean;
  reviewComplete?: ReviewCompleteAction;
}
