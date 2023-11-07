import { BaseCodeTable } from "./base-code-table";

export interface Species extends BaseCodeTable {
  species: string;
  legacy: string;
}
