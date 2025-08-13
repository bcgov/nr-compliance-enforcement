import { BaseComplaintOutcomeCreateInput } from "@/app/types/app/complaint-outcomes/base-case-file-input";
import { AnimalOutcomeInput } from "./animal-outcome-input";

export interface CreateAnimalOutcomeInput extends BaseComplaintOutcomeCreateInput {
  wildlife: AnimalOutcomeInput;
}
