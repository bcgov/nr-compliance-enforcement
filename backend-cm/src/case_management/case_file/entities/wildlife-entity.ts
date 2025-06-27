import { CaseFileAction } from "../../case_file_action/entities/case_file_action.entity";

export interface Wildlife {
  order: number;
  id: string;
  species: string;
  sex?: string;
  sexDescription?: string;
  age?: string;
  ageDescription?: string;
  categoryLevel?: string;
  categoryLevelDescription?: string;
  identifyingFeatures?: string;
  outcome?: string;
  outcomeDescription?: string;
  outcomeActionedBy?: string;
  outcomeActionedByDescription?: string;
  tags?: Array<EarTag>;
  drugs?: Array<DrugUsed>;
  actions?: Array<CaseFileAction>;
}

export interface EarTag {
  id: string;
  ear: string;
  earDescription: string;
  identifier: string;
}

export interface DrugUsed {
  id: string;
  vial: string;
  drug: string;
  drugDescription: string;
  amountUsed: string;
  injectionMethod: string;
  injectionMethodDescription: string;
  remainingUse?: string;
  remainingUseDescription?: string;
  additionalComments?: string;
}
