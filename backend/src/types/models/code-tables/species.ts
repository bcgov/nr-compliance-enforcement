import { CodeTable } from "../../models/code-tables/code-table";

export interface Species extends CodeTable {
  species: string;
  legacy: string;
}
