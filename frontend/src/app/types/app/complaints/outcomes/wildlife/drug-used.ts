export interface DrugUsed {
  id: number;
  
  vial: string;
  vialErrorMessage: string;
  drug: string;
  drugErrorMessage: string;
  amountUsed: string;
  amountUsedErrorMessage: string;
  amountDiscarded: string;

  injectionMethod: string;
  injectionMethodErrorMessage: string;
  discardMethod: string;

  reactions: string;
  remainingUse: string;
}
