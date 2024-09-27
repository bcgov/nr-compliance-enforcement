import { BaseCodeTable } from "./code-table";

export interface ScheduleSectorXref extends BaseCodeTable {
  schedule: string;
  sector: string;
}
