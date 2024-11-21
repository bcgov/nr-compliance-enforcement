export interface DrugUsed {
  id: string;

  vial: string;
  drug: string;
  amountUsed: string;
  injectionMethod: string;

  remainingUse: string | null;
  additionalComments: string;

  order: number;
}
