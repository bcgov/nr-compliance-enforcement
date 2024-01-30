import { AnimalTag } from "./animal-tag";
import { DrugUsed } from "./drug-used";

export interface AnimalOutcome {
  species: string;
  sex: string;
  age: string;
  threatLevel: string;
  conflictHistory: string;

  tags: Array<AnimalTag>;
  drugs: Array<DrugUsed>;

  outcome: string;
  officer: string;
  date?: Date;
}