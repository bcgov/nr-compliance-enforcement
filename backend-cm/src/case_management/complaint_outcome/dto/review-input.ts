export class ReviewInput {
  complaintId: string;
  outcomeAgencyCode: string;
  userId: string;
  isReviewRequired: boolean;
  complaintOutcomeGuid?: string;
  reviewComplete?: {
    actor: string;
    date: Date;
    actionCode: string;
    actionId?: string;
    activeIndicator?: boolean;
  };
}
