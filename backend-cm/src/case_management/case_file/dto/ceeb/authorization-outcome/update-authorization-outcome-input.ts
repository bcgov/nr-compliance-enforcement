import { PermitSiteInput } from "./permit-site-input";

export interface UpdateAuthorizationOutcomeInput {
  caseIdentifier: string;
  agencyCode: string;
  caseCode: string;
  updateUserId: string;
  input: PermitSiteInput;
}
