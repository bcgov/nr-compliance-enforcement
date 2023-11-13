import { BaseCodeTable } from "./base-code-table";

export interface OrganizationUnit extends BaseCodeTable { 
   organizationUnit: string
   organizationUnitType?: string
}