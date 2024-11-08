import { AnimalTagV2 } from "./animal-tag";
import { DrugAuthorization } from "./drug-authorization";
import { DrugUsed } from "./drug-used";

export interface AnimalOutcome {
  id: string;

  species: string;
  sex?: string;
  age?: string;
  threatLevel?: string;
  conflictHistory?: string;

  tags: Array<AnimalTagV2>;
  drugs: Array<DrugUsed>;
  drugAuthorization?: DrugAuthorization;

  outcome?: string;
  officer?: string;
  date?: Date;

  editable?: boolean;
  order: number;
}
