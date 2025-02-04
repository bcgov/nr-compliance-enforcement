import { BaseCodeTable } from "./code-table";

export interface Equipment extends BaseCodeTable {
  equipment: string;
  isTrapIndicator: boolean;
  hasQuantityIndicator: boolean;
}
