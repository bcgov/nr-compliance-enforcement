import { BaseComplaintOutcomeInput } from "../base-complaint-outcome-input";
import { WildlifeInput } from "./wildlife-input";

export interface UpdateWildlifeInput extends BaseComplaintOutcomeInput {
  wildlife: WildlifeInput;
}
