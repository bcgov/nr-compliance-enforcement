import { BaseComplaintOutcomeUpdateInput } from "@/app/types/app/complaint-outcomes/base-case-file-input";

export interface DeleteAnimalOutcomeInput extends BaseComplaintOutcomeUpdateInput {
  outcomeId: string;
}
