export interface DrugUsed {
  vial: string;
  drug: string;
  amountUsed: number;
  amountDiscarded: number;

  reactions: string;
  remainingUse: string;

  officer: string;
  date: Date;
}
