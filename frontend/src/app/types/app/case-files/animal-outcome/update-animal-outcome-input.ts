import { BaseCaseFileUpdateInput } from "../base-case-file-input";
import { AnimalOutcomeInput } from "./animal-outcome-input";

export interface UpdateAnimalOutcomeInput extends BaseCaseFileUpdateInput {
  wildlife: AnimalOutcomeInput;
}
