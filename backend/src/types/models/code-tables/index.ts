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
import { OrganizationCodeTable } from "./organization-code-table";

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
  "cos-organization-unit"
];

export const AvailableAgencies = [
   "cos"
]

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
  Violation,
  OrganizationCodeTable
};
