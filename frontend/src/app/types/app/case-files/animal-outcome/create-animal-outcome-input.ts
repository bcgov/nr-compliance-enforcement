import { BaseCaseFileCreateInput } from "../base-case-file-input";
import { AnimalOutcomeInput } from "./animal-outcome-input";

export interface CreateAnimalOutcomeInput extends BaseCaseFileCreateInput {
  wildlife: AnimalOutcomeInput;
}
