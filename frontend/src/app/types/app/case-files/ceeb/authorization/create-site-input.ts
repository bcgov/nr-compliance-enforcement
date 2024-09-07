import { BaseCaseFileCreateInput } from "../../base-case-file-input";
import { Site } from "./site";

export interface CreateSiteInput extends BaseCaseFileCreateInput {
  site: Site;
}
