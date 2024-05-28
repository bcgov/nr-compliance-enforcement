import { AnimalOutcomeActionInput } from "./animal-outcome-action-input";
import { DrugUsedInput } from "./drug-used-input";
import { EarTagInput } from "./ear-tag-input";

export interface AnimalOutcomeInput {
  id?: string;
  species: string;
  sex?: string;
  age?: string;
  categoryLevel?: string;
  conflictHistory?: string;
  outcome?: string;
  tags?: Array<EarTagInput>;
  drugs?: Array<DrugUsedInput>;

  //-- if there's any drugs added or
  //-- an outcome selected then add an
  //-- action to the collection
  actions?: Array<AnimalOutcomeActionInput>;
}
