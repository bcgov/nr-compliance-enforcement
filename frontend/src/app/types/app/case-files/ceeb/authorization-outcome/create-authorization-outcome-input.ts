import { BaseCaseFileCreateInput } from "../../base-case-file-input";
import { PermitSite } from "./permit-site";

export interface CreateAuthorizationOutcomeInput extends BaseCaseFileCreateInput {
  input: PermitSite;
}
