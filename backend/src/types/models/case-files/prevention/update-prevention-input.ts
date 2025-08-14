import { BaseComplaintOutcomeInput } from "../base-complaint-outcome-input";
import { PreventionDto } from "./prevention";

export interface UpdatePreventionInput extends BaseComplaintOutcomeInput {
  prevention: PreventionDto;
}
