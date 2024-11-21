import { BaseCaseFileUpdateInput } from "@apptypes/app/case-files/base-case-file-input";

export interface UpdateSupplementalNotesInput extends BaseCaseFileUpdateInput {
  note: string;
}
