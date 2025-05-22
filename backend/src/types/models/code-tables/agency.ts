import { BaseCodeTable } from "../../models/code-tables/code-table";

export interface Agency extends BaseCodeTable {
  agency: string;
  externalAgencyInd;
}
