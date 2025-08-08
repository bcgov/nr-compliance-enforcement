import { BaseComplaintOutcomeInput } from "../../base-complaint-outcome-input";
import { PermitSiteDto } from "./permit-site-input";

export interface CreateAuthorizationOutcomeInput extends BaseComplaintOutcomeInput {
  input: PermitSiteDto;
}
