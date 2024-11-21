import { BaseCaseFileUpdateInput } from "@apptypes/app/case-files/base-case-file-input";
import { AnimalOutcomeInput } from "./animal-outcome-input";

export interface UpdateAnimalOutcomeInput extends BaseCaseFileUpdateInput {
  wildlife: AnimalOutcomeInput;
}
