import { DrugUsedInput } from "./drug-used-input";
import { EarTagInput } from "./ear-tag-input";
import { WildlifeActionInput } from "./wildlife-action-input";

export interface WildlifeInput {
  id?: string;
  species: string;
  sex?: string;
  age?: string;
  categoryLevel?: string;
  conflictHistory?: string;
  outcome?: string;
  outcomeActionedBy?: string;
  tags?: Array<EarTagInput>;
  drugs?: Array<DrugUsedInput>;
  actions?: Array<WildlifeActionInput>;
  identifyingFeatures?: string;
}
