import { CodeTable } from "../code-tables/code-table";

export interface CodeTableState {
  [key: string]: any;
  
  agencyCodes: Array<CodeTable>;
  complaintStatusCodes: Array<CodeTable>;
  violationCodes: Array<CodeTable>;
  speciesCodes: Array<CodeTable>;
  wildlifeNatureOfComplaintCodes: Array<CodeTable>;
  areaCodes: Array<CodeTable>;
  attractantCodes: Array<CodeTable>;
  regions: Array<CodeTable>;
  zones: Array<CodeTable>;
  communities: Array<CodeTable>;
}
