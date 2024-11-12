import { BaseCaseFileUpdateInput } from "@apptypes/app/case-files/base-case-file-input";

export interface DeleteAnimalOutcomeInput extends BaseCaseFileUpdateInput {
  outcomeId: string;
}
