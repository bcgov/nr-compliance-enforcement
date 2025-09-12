import { PermitSiteInput } from "./permit-site-input";

export interface CreateAuthorizationOutcomeInput {
  complaintId: string;
  outcomeAgencyCode: string;
  createUserId: string;
  input: PermitSiteInput;
}
