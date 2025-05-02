import { BaseCodeTable } from "./code-table";

export interface PreventionType extends BaseCodeTable {
  agencyCode: string;
  preventionType: string;
}
