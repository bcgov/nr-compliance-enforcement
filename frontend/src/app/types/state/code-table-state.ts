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
import { AssessmentType } from "../app/code-tables/assessment-type";
import { PreventionType } from "../app/code-tables/prevention-type";
import { Sex } from "../app/code-tables/sex";
import { Age } from "../app/code-tables/age";
import { ThreatLevel } from "../app/code-tables/threat-level";
import { ConflictHistory } from "../app/code-tables/conflict-history";
import { EarTag } from "../app/code-tables/ear-tag";
import { WildlifeComplaintOutcome } from "../app/code-tables/wildlife-complaint-outcome";
import { Drug } from "../app/code-tables/drug";
import { DrugMethod } from "../app/code-tables/drug-method";
import { DrugRemainingOutcome } from "../app/code-tables/drug-remaining-outcome";
import { Equipment } from "../app/code-tables/equipment";
import { GirType } from "../app/code-tables/gir-type";
import { Discharge } from "../app/code-tables/discharge";
import { NonCompliance } from "../app/code-tables/non-compliance";
import { Rationale } from "../app/code-tables/rationale";
import { Sector } from "../app/code-tables/sector";
import { Schedule } from "../app/code-tables/schedule";
import { DecisionType } from "../app/code-tables/decision-type";
import { TeamType } from "../app/code-tables/team";
import { ComplaintMethodReceivedType } from "../app/code-tables/complaint-method-received-type";
import { ScheduleSectorXref } from "../app/code-tables/schedule-sector-xref";

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
    | Array<PreventionType>
    | Array<Sex>
    | Array<Age>
    | Array<ThreatLevel>
    | Array<ConflictHistory>
    | Array<EarTag>
    | Array<WildlifeComplaintOutcome>
    | Array<Drug>
    | Array<DrugMethod>
    | Array<DrugRemainingOutcome>
    | Array<Equipment>
    | Array<Discharge>
    | Array<NonCompliance>
    | Array<Rationale>
    | Array<Sector>
    | Array<Schedule>
    | Array<GirType>
    | Array<ScheduleSectorXref>
    | Array<ComplaintMethodReceivedType>
    | Array<DecisionType>
    | Array<TeamType>;

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
  "prevention-type": Array<PreventionType>;
  sex: Array<Sex>;
  age: Array<Age>;
  "threat-level": Array<ThreatLevel>;
  "conflict-history": Array<ConflictHistory>;
  "ear-tag": Array<EarTag>;
  "wildlife-outcomes": Array<WildlifeComplaintOutcome>;
  drugs: Array<Drug>;
  "drug-methods": Array<DrugMethod>;
  "drug-remaining-outcomes": Array<DrugRemainingOutcome>;
  equipment: Array<Equipment>;
  "gir-type": Array<GirType>;
  discharge: Array<Discharge>;
  "non-compliance": Array<NonCompliance>;
  rationale: Array<Rationale>;
  sector: Array<Sector>;
  schedule: Array<Schedule>;
  "schedule-sector-type": Array<ScheduleSectorXref>;
  "decision-type": Array<DecisionType>;
  team: Array<TeamType>;
  "complaint-method-received-codes": Array<ComplaintMethodReceivedType>;
  "lead-agency": Array<Agency>;
}
