export interface DrugUsedInput {
  id?: number | string;

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
  id?: string;

  vial: string;
  drug: string;
  amountUsed: string;
  injectionMethod: string;
  reactions: string;

  remainingUse: string | null;
  amountDiscarded: string;
  discardMethod: string;
}
