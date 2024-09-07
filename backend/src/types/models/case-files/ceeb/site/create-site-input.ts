import { BaseCaseFileInput } from "../../base-case-file-input";
import { SiteInput } from "./site-input";

export interface CreateSiteInput extends BaseCaseFileInput {
  site: SiteInput;
}
