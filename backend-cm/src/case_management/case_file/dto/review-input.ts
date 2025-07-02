export class ReviewInput {
  leadIdentifier: string;
  agencyCode: string;
  caseCode: string;
  userId: string;
  isReviewRequired: boolean;
  caseIdentifier?: string;
  reviewComplete?: {
    actor: string;
    date: Date;
    actionCode: string;
    actionId?: string;
    activeIndicator?: boolean;
  };
}
