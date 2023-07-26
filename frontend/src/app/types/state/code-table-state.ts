import { CodeTable } from "../code-tables/code-table";

export interface CodeTableState {
  agencyCodes: Array<CodeTable>;
  complaintStatusCodes: Array<CodeTable>;
  violationCodes: Array<CodeTable>;
  speciesCodes: Array<CodeTable>;
  wildlifeNatureOfComplaintCodes: Array<CodeTable>;
  areaCodes: Array<CodeTable>;
  attractantCodes: Array<CodeTable>;
}
