import { BaseCaseFileInput } from "../base-case-file-input";
import { WildlifeInput } from "./wildlife-input";

export interface UpdateWildlifeInput extends BaseCaseFileInput {
  wildlife: WildlifeInput;
}
