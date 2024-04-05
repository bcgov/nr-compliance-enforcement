import { UUID } from "crypto";
import { ReviewCompleteAction } from "./review-complete-action";

export interface ReviewInput {
  caseIdentifier?: UUID;
  leadIdentifier: string;
  userId: string;
  agencyCode: string;
  caseCode: string;
  isReviewRequired: boolean;
  reviewComplete?: ReviewCompleteAction
}
