import { DrugInput } from "./drug-input";
import { EarTagInput } from "./ear-tag-input";

export interface WildlifeInput {
  categoryLevel?: string;
  conflictHistory?: string;
  sex?: string;
  age?: string;
  outcome?: string;
  species: string;
  earTags?: Array<EarTagInput>;
  drugs?: Array<DrugInput>;
}
