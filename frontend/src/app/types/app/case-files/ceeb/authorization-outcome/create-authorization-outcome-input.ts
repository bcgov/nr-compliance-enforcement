import { BaseCaseFileCreateInput } from "@apptypes/app/case-files/base-case-file-input";
import { PermitSite } from "./permit-site";

export interface CreateAuthorizationOutcomeInput extends BaseCaseFileCreateInput {
  input: PermitSite;
}
