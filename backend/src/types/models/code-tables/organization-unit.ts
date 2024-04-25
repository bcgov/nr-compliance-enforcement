import { BaseCodeTable } from "./code-table";

export interface OrganizationUnit extends BaseCodeTable {
  organizationUnit: string;
  organizationUnitType?: string;
}
