import { BaseCaseFileUpdateInput } from "../../base-case-file-input";
import { Site } from "./site";

export interface UpdateSiteInput extends BaseCaseFileUpdateInput {
  site: Site;
}
