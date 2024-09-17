import { BaseCaseFileUpdateInput } from "../../base-case-file-input";
import { PermitSite } from "./permit-site";

export interface UpdateAuthorizationOutcomeInput extends BaseCaseFileUpdateInput {
  input: PermitSite;
}
