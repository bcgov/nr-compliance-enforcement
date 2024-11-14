import { BaseCodeTable } from "./code-table";

export interface Species extends BaseCodeTable {
  species: string;
  legacy: string;
  isLargeCarnivore: boolean;
}
