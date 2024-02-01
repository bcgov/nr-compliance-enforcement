import { Agency } from "../app/code-tables/agency";
import { Attractant } from "../app/code-tables/attactant";
import { ComplaintStatus } from "../app/code-tables/complaint-status";
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
import { ReportedBy } from "../app/code-tables/reported-by";
import { Justification } from "../app/code-tables/justification";
import { AssessmentType } from "../app/code-tables/assesment-type";
import { PreventEducationAction } from "../app/code-tables/prevent-education-action";
import { Sex } from "../app/code-tables/sex";
import { Age } from "../app/code-tables/age";
import { ThreatLevel } from "../app/code-tables/threat-level";
import { ConflictHistory } from "../app/code-tables/conflict-history";
import { EarTag } from "../app/code-tables/ear-tag";
import { WildlifeComplaintOutcome } from "../app/code-tables/wildlife-complaint-outcome";
import { Drug } from "../app/code-tables/drug";
import { DrugMethod } from "../app/code-tables/drug-method";
import { DrugRemainingOutcome } from "../app/code-tables/drug-remaining-outcome";

export interface CodeTableState {
  [key: string]:
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
    | Array<Community>
    | Array<ReportedBy>
    | Array<Justification>
    | Array<AssessmentType>
    | Array<PreventEducationAction>
    | Array<Sex>
    | Array<Age>
    | Array<ThreatLevel>
    | Array<ConflictHistory>
    | Array<EarTag>
    | Array<WildlifeComplaintOutcome>
    | Array<Drug>
    | Array<DrugMethod>
    | Array<DrugRemainingOutcome>

  agency: Array<Agency>;
  attractant: Array<Attractant>;
  "complaint-status": Array<ComplaintStatus>;
  "complaint-type": Array<ComplaintType>;
  "nature-of-complaint": Array<NatureOfComplaint>;
  species: Array<Species>;
  violation: Array<Violation>;
  "area-codes": Array<OrganizationCodeTable>;
  regions: Array<Region>;
  zones: Array<Zone>;
  communities: Array<Community>;
  "reported-by": Array<ReportedBy>;
  justification: Array<Justification>;
  "assessment-type": Array<AssessmentType>;
  "prevent-education-action": Array<PreventEducationAction>;
  sex: Array<Sex>
  age: Array<Age>,
  "threat-level": Array<ThreatLevel>,
  "conflict-history": Array<ConflictHistory>
  "ear-tag": Array<EarTag>
  "wildlife-outcomes": Array<WildlifeComplaintOutcome>
  drugs: Array<Drug>,
  "drug-methods": Array<DrugMethod>,
  "drug-remaining-outcomes": Array<DrugRemainingOutcome>,
}
