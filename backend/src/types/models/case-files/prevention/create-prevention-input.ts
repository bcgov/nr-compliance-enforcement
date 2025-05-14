import { BaseCaseFileInput } from "../base-case-file-input";
import { PreventionDto } from "./prevention";

export interface CreatePreventionInput extends BaseCaseFileInput {
  prevention: PreventionDto;
}
