import { CodeTable } from "./code-table";
import { Agency } from "./agency";
import { Attractant } from "./attractant";
import { ComplaintStatus } from "./complaint-status";
import { NatureOfComplaint } from "./nature-of-complaint";
import { OrganizationUnitType } from "./organization-unit-type";
import { OrganizationUnit } from "./organization-unit";
import { PersonComplaintType } from "./person-complaint-type";
import { Species } from "./species";
import { Violation } from "./violation";

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
export {
  Agency,
  Attractant,
  ComplaintStatus,
  NatureOfComplaint,
  OrganizationUnitType,
  OrganizationUnit,
  PersonComplaintType,
  Species,
  Violation
};
