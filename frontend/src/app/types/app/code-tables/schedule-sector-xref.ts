import { BaseCodeTable } from "./base-code-table";

export interface ScheduleSectorXref extends BaseCodeTable {
  schedule: string;
  sector: string;
}
