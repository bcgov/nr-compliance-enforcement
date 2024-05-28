import { BaseCaseFileInput } from "../base-case-file-input";
import { WildlifeInput } from "./wildlife-input";

export interface CreateWildlifeInput extends BaseCaseFileInput {
  wildlife: WildlifeInput;
}
