import { BaseComplaintOutcomeInput } from "../../base-complaint-outcome-input";
import { PermitSiteDto } from "./permit-site-input";

export interface UpdateAuthorizationOutcomeInput extends BaseComplaintOutcomeInput {
  input: PermitSiteDto;
}
