export interface DrugUsed {
  id: number;
  
  vial: string;
  drug: string;
  amountUsed: number;
  amountDiscarded: number;

  injectionMethod: string;
  discardMethod: string;

  reactions: string;
  remainingUse: string;

  officer: string;
  date?: Date;
}
