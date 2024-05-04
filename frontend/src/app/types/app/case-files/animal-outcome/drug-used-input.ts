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
