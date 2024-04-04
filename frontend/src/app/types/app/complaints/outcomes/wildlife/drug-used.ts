export interface DrugUsed {
  id: number;
  
  vial: string;
  vialErrorMessage: string;
  drug: string;
  drugErrorMessage: string;
  amountUsed: number;
  amountUsedErrorMessage: string;
  amountDiscarded: number;

  injectionMethod: string;
  injectionMethodErrorMessage: string;
  discardMethod: string;

  reactions: string;
  remainingUse: string;
}
