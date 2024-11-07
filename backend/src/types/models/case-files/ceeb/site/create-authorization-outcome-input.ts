import { BaseCaseFileInput } from "../../base-case-file-input";
import { PermitSiteDto } from "./permit-site-input";

export interface CreateAuthorizationOutcomeInput extends BaseCaseFileInput {
  input: PermitSiteDto;
}
