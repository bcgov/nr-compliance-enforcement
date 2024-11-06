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
  id: string;

  vial: string;
  drug: string;
  amountUsed: string;
  amountDiscarded: string;

  injectionMethod: string;
  discardMethod: string;

  reactions: string;
  remainingUse: string | null;

  order: number;
}

export interface DrugUsedV3 {
  id: string;

  vial: string;
  drug: string;
  amountUsed: string;
  injectionMethod: string;

  remainingUse: string | null;
  additionalComments: string;

  order: number;
}
