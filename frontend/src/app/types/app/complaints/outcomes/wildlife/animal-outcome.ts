import { AnimalTag, AnimalTagV2 } from "./animal-tag";
import { DrugAuthorization } from "./drug-authorization";
import { DrugUsed, DrugUsedV2, DrugUsedV3 } from "./drug-used";

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

  isInEditMode: boolean;
}

export interface AnimalOutcomeV2 {
  id: string;

  species: string;
  sex?: string;
  age?: string;
  threatLevel?: string;
  conflictHistory?: string;

  tags: Array<AnimalTagV2>;
  drugs: Array<DrugUsedV2>;
  drugAuthorization?: DrugAuthorization;

  outcome?: string;
  officer?: string;
  date?: Date;

  editable?: boolean;
  order: number;
}

export interface AnimalOutcomeV3 {
  id: string;

  species: string;
  sex?: string;
  age?: string;
  threatLevel?: string;
  conflictHistory?: string;

  tags: Array<AnimalTagV2>;
  drugs: Array<DrugUsedV3>;
  drugAuthorization?: DrugAuthorization;

  outcome?: string;
  officer?: string;
  date?: Date;

  editable?: boolean;
  order: number;
}
