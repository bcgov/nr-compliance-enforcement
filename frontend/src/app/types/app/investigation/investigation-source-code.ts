import { BaseCodeTable } from "../code-tables/base-code-table";

export interface InvestigationSourceCode extends BaseCodeTable {
  investigationSourceCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeInd: boolean;
}
