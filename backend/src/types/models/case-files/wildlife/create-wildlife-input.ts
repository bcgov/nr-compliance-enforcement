import { BaseComplaintOutcomeInput } from "../base-complaint-outcome-input";
import { WildlifeInput } from "./wildlife-input";

export interface CreateWildlifeInput extends BaseComplaintOutcomeInput {
  wildlife: WildlifeInput;
}
