import { BaseCodeTable } from "./code-table";
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
import { ComplaintType } from "./complaint-type";
import { Sector } from "./sector";
import { Community } from "./community";
import { Zone } from "./zone";
import { ReportedBy } from "./reported-by";
import { Justification } from "./justification";
import { AssessmentType } from "./assessment-type";
import { PreventionType } from "./prevention-type";
import { Equipment } from "./equipment";
import { GirType } from "./gir-type";
import { TeamType } from "./team-type";
import { IPMAuthCategory } from "./ipm-auth-category";
import { ComplaintMethodReceivedType } from "./complaint-method-received-type";

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
  "cos-organization-unit",
  "complaint-type",
  "reported-by",
  "justification",
  "assessment-type",
  "prevention-type",
  "sex",
  "age",
  "threat-level",
  "conflict-history",
  "ear-tag",
  "drugs",
  "drug-methods",
  "drug-remaining-outcomes",
  "wildlife-outcomes",
  "hwcr-outcome-actioned-by-codes",
  "equipment",
  "gir-type",
  "discharge",
  "non-compliance",
  "sector",
  "schedule",
  "schedule-sector-type",
  "decision-type",
  "team",
  "complaint-method-received-codes",
  "lead-agency",
  "assessment-cat1-type",
  "case-location-type",
  "ipm-auth-category",
  "equipment-status",
  "park-area",
  "email-reference",
  "party-type",
  "party-association-role",
];

export const AvailableAgencies = ["cos"];

export default BaseCodeTable;
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
  OrganizationCodeTable,
  ComplaintType,
  Sector,
  IPMAuthCategory,
  Zone,
  Community,
  ReportedBy,
  Justification,
  AssessmentType,
  PreventionType,
  Equipment,
  GirType,
  TeamType,
  ComplaintMethodReceivedType,
};
