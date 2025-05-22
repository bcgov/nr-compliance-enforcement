import { BaseCodeTable } from "./base-code-table";

export interface Agency extends BaseCodeTable {
  agency: string;
  externalAgencyInd: boolean;
}
