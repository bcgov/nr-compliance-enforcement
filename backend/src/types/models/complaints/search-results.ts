import { ComplaintDtoAlias } from "src/types/models/complaints/dtos/complaint-dto-alias";

export interface SearchResults {
  complaints: Array<ComplaintDtoAlias>;
  totalCount: number;
}
