import { AnimalTag } from "./animal-tag";
import { DrugAuthorization } from "./drug-authorization";
import { DrugUsed } from "./drug-used";

import Option from "../../../../../types/app/option";

export interface AnimalOutcome {
  id: string | undefined; 
  
  species: Option | undefined;
  sex: Option | undefined;
  age: Option | undefined;
  threatLevel: Option | undefined;
  conflictHistory: Option | undefined;

  tags: Array<AnimalTag>;
  drugs: Array<DrugUsed>;
  drugAuthorization?: DrugAuthorization;
  
  outcome: Option | undefined;
  officer: Option | undefined;
  date?: Date;

  isInEditMode: boolean
}