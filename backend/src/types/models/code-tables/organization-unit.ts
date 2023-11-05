import { CodeTable } from "../../models/code-tables/code-table";

export interface OrganizationUnit extends CodeTable { 
   organizationUnit: string
   organizationUnitType?: string
}