import { PermitSiteInput } from "./permit-site-input";

export interface CreateAuthorizationOutcomeInput {
  leadIdentifier: string;
  agencyCode: string;
  caseCode: string;
  createUserId: string;
  input: PermitSiteInput;
}
