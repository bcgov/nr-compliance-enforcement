export interface DrugUsed {
  id: number;

  vial: string;
  drug: string;
  amountUsed: string;
  amountDiscarded: string;

  injectionMethod: string;
  discardMethod: string;

  reactions: string;
  remainingUse: string;

  vialErrorMessage: string;
  drugErrorMessage: string;
  amountUsedErrorMessage: string;
  amountDiscardedErrorMessage: string;
  injectionMethodErrorMessage: string;
}

export interface DrugUsedV2 {
  id: number;

  vial: string;
  drug: string;
  amountUsed: string;
  amountDiscarded: string;

  injectionMethod: string;
  discardMethod: string;

  reactions: string;
  remainingUse: string;
}
