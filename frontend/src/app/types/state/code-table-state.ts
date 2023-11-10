import { Agency } from "../app/code-tables/agency";
import { Attractant } from "../app/code-tables/attactant";
import { ComplaintStatus } from "../app/code-tables/complaint-status";
import { CodeTable } from "../code-tables/code-table";
import { NatureOfComplaint } from "../app/code-tables/nature-of-complaint";
import { OrganizationUnitType } from "../app/code-tables/organization-unit-type";
import { OrganizationUnit } from "../app/code-tables/organization-unit";
import { PersonComplaintType } from "../app/code-tables/person-complaint-type";
import { Species } from "../app/code-tables/species";
import { Violation } from "../app/code-tables/violation";
import { OrganizationCodeTable } from "../app/code-tables/organization-code-table";
import { ComplaintType } from "../app/code-tables/complaint-type";
import { Region } from "../app/code-tables/region";
import { Zone } from "../app/code-tables/zone";
import { Community } from "../app/code-tables/community";

export interface CodeTableState {
  [key: string]:
    | Array<CodeTable>
    | Array<Agency>
    | Array<Attractant>
    | Array<ComplaintStatus>
    | Array<NatureOfComplaint>
    | Array<OrganizationUnitType>
    | Array<OrganizationUnit>
    | Array<PersonComplaintType>
    | Array<Species>
    | Array<Violation>
    | Array<OrganizationCodeTable>
    | Array<ComplaintType>
    | Array<Region>
    | Array<Zone>
    | Array<Community>;
    

  //-- current tables
  agencyCodes: Array<CodeTable>;
  attractantCodes: Array<CodeTable>;
  complaintStatusCodes: Array<CodeTable>;
  complaintTypeCodes: Array<CodeTable>;
  wildlifeNatureOfComplaintCodes: Array<CodeTable>;
  speciesCodes: Array<CodeTable>;
  violationCodes: Array<CodeTable>;

  //-- updated tables
  agency: Array<Agency>;
  attractants: Array<Attractant>;
  "complaint-status": Array<ComplaintStatus>;
  "complaint-type": Array<ComplaintType>;
  "nature-of-complaint": Array<NatureOfComplaint>;
  species: Array<Species>;
  violation: Array<Violation>;
  // "organization-unit-type": Array<OrganizationUnitType>;
  // "organization-unit": Array<OrganizationUnit>;
  // "person-complaint": Array<PersonComplaintType>;

  // "cos-organization-unit": Array<OrganizationCodeTable>;

  "area-codes": Array<OrganizationCodeTable>;
  regions: Array<Region>;
  zones: Array<Zone>;
  communities: Array<Community>;
}
