export interface DrugUsedInput {
  id?: number;

  vial: string;
  drug: string;
  amountUsed: string;
  injectionMethod: string;

  remainingUse: string;
  additionalComments: string;
}
