import { Complaint } from "../complaint-type";

// Subset of the CHEFS readSubmission response used by NatSuite.
export interface ChefsSubmissionResponse {
  submission: {
    id: string;
    formVersionId: string;
    draft: boolean;
    submission: {
      data: Complaint;
    };
  };
}
