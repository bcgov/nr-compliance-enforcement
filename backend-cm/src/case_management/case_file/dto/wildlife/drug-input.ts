export interface DrugInput {
  id?: string;

  vial: string;
  drug: string;
  amountUsed: string;
  injectionMethod: string;

  remainingUse: string;
  additionalComments: string;
}
