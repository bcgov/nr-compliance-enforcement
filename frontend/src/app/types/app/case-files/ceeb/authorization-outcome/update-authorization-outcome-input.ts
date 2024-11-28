import { BaseCaseFileUpdateInput } from "@apptypes/app/case-files/base-case-file-input";
import { PermitSite } from "./permit-site";

export interface UpdateAuthorizationOutcomeInput extends BaseCaseFileUpdateInput {
  input: PermitSite;
}
