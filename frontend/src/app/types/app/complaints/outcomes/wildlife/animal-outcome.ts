import { AnimalTag } from "./animal-tag";
import { DrugAuthorization } from "./drug-authorization";
import { DrugUsed } from "./drug-used";

export interface AnimalOutcome {
  species: string;
  sex: string;
  age: string;
  threatLevel: string;
  conflictHistory: string;

  tags: Array<AnimalTag>;
  drugs: Array<DrugUsed>;
  drugAuthorization?: DrugAuthorization
  
  outcome: string;
  officer: string;
  date?: Date;
}