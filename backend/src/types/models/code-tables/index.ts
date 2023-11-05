import { CodeTable } from "./code-table";
import { Agency } from "./agency";
import { Attractant } from "./attractant";
import { ComplaintStatus } from "./complaint-status";




export const AvailableCodeTables = [
  "agency",
  "attractant",
  "complaint-status",
  "complaint-type",
  "nature-of-complaint",
  "organization-unit-type",
  "organization-unit",
  "person-complaint",
  "species",
  "violation",
];

export default CodeTable;
export { Agency, Attractant, ComplaintStatus };
