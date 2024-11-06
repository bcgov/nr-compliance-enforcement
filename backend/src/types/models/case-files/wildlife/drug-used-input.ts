export interface DrugUsedInput {
  id?: number;

  vial: string;
  drug: string;
  amountUsed: string;
  injectionMethod: string;
  reactions: string;

  remainingUse: string;
  amountDiscarded: string;
  discardMethod: string;
}

export interface DrugUsedInputV2 {
  id?: number;

  vial: string;
  drug: string;
  amountUsed: string;
  injectionMethod: string;

  remainingUse: string;
  additionalComments: string;
}
