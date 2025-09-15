import { PermitSiteInput } from "./permit-site-input";

export interface UpdateAuthorizationOutcomeInput {
  complaintOutcomeGuid: string;
  outcomeAgencyCode: string;
  updateUserId: string;
  input: PermitSiteInput;
}
