import { BaseCaseFileCreateInput } from "@apptypes/app/case-files/base-case-file-input";
import { AnimalOutcomeInput } from "./animal-outcome-input";

export interface CreateAnimalOutcomeInput extends BaseCaseFileCreateInput {
  wildlife: AnimalOutcomeInput;
}
