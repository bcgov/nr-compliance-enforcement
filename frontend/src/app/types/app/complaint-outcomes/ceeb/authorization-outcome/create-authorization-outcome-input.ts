import { BaseComplaintOutcomeCreateInput } from "@/app/types/app/complaint-outcomes/base-case-file-input";
import { PermitSite } from "./permit-site";

export interface CreateAuthorizationOutcomeInput extends BaseComplaintOutcomeCreateInput {
  input: PermitSite;
}
