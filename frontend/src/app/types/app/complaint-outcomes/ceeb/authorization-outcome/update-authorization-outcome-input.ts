import { BaseComplaintOutcomeUpdateInput } from "@/app/types/app/complaint-outcomes/base-case-file-input";
import { PermitSite } from "./permit-site";

export interface UpdateAuthorizationOutcomeInput extends BaseComplaintOutcomeUpdateInput {
  input: PermitSite;
}
