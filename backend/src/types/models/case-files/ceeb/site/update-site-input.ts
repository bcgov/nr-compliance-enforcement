import { BaseCaseFileInput } from "../../base-case-file-input";
import { SiteInput } from "./site-input";

export interface UpdateSiteInput extends BaseCaseFileInput {
  site: SiteInput;
}
