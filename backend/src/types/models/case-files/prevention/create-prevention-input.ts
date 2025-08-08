import { BaseComplaintOutcomeInput } from "../base-complaint-outcome-input";
import { PreventionDto } from "./prevention";

export interface CreatePreventionInput extends BaseComplaintOutcomeInput {
  prevention: PreventionDto;
}
