import { BaseCaseFileInput } from "../base-case-file-input";
import { PreventionDto } from "./prevention";

export interface UpdatePreventionInput extends BaseCaseFileInput {
  prevention: PreventionDto;
}
