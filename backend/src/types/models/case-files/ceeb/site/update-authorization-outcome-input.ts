import { BaseCaseFileInput } from "../../base-case-file-input";
import { PermitSiteInput } from "./permit-site-input";

export interface UpdateAuthorizationOutcomeInput extends BaseCaseFileInput {
  input: PermitSiteInput;
}
