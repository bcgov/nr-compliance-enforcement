import { BaseCaseFileUpdateInput } from "../base-case-file-input";

export interface DeleteAnimalOutcomeInput extends BaseCaseFileUpdateInput {
  outcomeId: string;
}
