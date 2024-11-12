import { BaseCaseFileCreateInput } from "@apptypes/app/case-files/base-case-file-input";

export interface CreateSupplementalNotesInput extends BaseCaseFileCreateInput {
  note: string;
}
