import { BaseComplaintOutcomeUpdateInput } from "@/app/types/app/complaint-outcomes/base-case-file-input";
import { AnimalOutcomeInput } from "./animal-outcome-input";

export interface UpdateAnimalOutcomeInput extends BaseComplaintOutcomeUpdateInput {
  wildlife: AnimalOutcomeInput;
}
