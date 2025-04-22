import { BaseCodeTable } from "./base-code-table";

export interface PreventionType extends BaseCodeTable {
  agencyCode: string;
  preventionType: string;
}
