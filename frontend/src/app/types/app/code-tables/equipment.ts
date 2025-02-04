import { BaseCodeTable } from "./base-code-table";

export interface Equipment extends BaseCodeTable {
  equipment: string;
  isTrapIndicator: boolean;
  hasQuantityIndicator: boolean;
}
