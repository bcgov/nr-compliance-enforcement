import { CodeTable } from "./code-table";
import { Agency } from "./agency";
import { Attractant } from "./attractant";
import { ComplaintStatus } from "./complaint-status";
import { NatureOfComplaint } from "./nature-of-complaint";
import { OrganizationUnitType } from "./organization-unit-type";
import { PersonComplaintType } from "./person-complaint-type";

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
export { Agency, Attractant, ComplaintStatus, NatureOfComplaint, OrganizationUnitType, PersonComplaintType };
