import { Agency } from "@apptypes/app/code-tables/agency";
import { Attractant } from "@apptypes/app/code-tables/attactant";
import { ComplaintStatus } from "@apptypes/app/code-tables/complaint-status";
import { NatureOfComplaint } from "@apptypes/app/code-tables/nature-of-complaint";
import { OrganizationUnitType } from "@apptypes/app/code-tables/organization-unit-type";
import { OrganizationUnit } from "@apptypes/app/code-tables/organization-unit";
import { PersonComplaintType } from "@apptypes/app/code-tables/person-complaint-type";
import { Species } from "@apptypes/app/code-tables/species";
import { Violation } from "@apptypes/app/code-tables/violation";
import { OrganizationCodeTable } from "@apptypes/app/code-tables/organization-code-table";
import { ComplaintType } from "@apptypes/app/code-tables/complaint-type";
import { Region } from "@apptypes/app/code-tables/region";
import { Zone } from "@apptypes/app/code-tables/zone";
import { Community } from "@apptypes/app/code-tables/community";
import { ReportedBy } from "@apptypes/app/code-tables/reported-by";
import { Justification } from "@apptypes/app/code-tables/justification";
import { AssessmentType } from "@apptypes/app/code-tables/assessment-type";
import { PreventionType } from "@apptypes/app/code-tables/prevention-type";
import { Sex } from "@apptypes/app/code-tables/sex";
import { Age } from "@apptypes/app/code-tables/age";
import { ThreatLevel } from "@apptypes/app/code-tables/threat-level";
import { ConflictHistory } from "@apptypes/app/code-tables/conflict-history";
import { EarTag } from "@apptypes/app/code-tables/ear-tag";
import { WildlifeComplaintOutcome } from "@apptypes/app/code-tables/wildlife-complaint-outcome";
import { HwcrOutcomeActionedBy } from "@apptypes/app/code-tables/hwcr-outcome-actioned-by";
import { Drug } from "@apptypes/app/code-tables/drug";
import { DrugMethod } from "@apptypes/app/code-tables/drug-method";
import { DrugRemainingOutcome } from "@apptypes/app/code-tables/drug-remaining-outcome";
import { Equipment } from "@apptypes/app/code-tables/equipment";
import { GirType } from "@apptypes/app/code-tables/gir-type";
import { Discharge } from "@apptypes/app/code-tables/discharge";
import { NonCompliance } from "@apptypes/app/code-tables/non-compliance";
import { Sector } from "@apptypes/app/code-tables/sector";
import { Schedule } from "@apptypes/app/code-tables/schedule";
import { DecisionType } from "@apptypes/app/code-tables/decision-type";
import { TeamType } from "@apptypes/app/code-tables/team";
import { ComplaintMethodReceivedType } from "@apptypes/app/code-tables/complaint-method-received-type";
import { ScheduleSectorXref } from "@apptypes/app/code-tables/schedule-sector-xref";
import { CaseLocationType } from "@apptypes/app/code-tables/case-location";
import { IPMAuthCategoryType } from "@apptypes/app/code-tables/ipm-auth-category";
import { EquipmentStatus } from "@/app/types/app/code-tables/equipment-status";
import { ParkArea } from "@/app/types/app/code-tables/park-area";
import { EmailReference } from "@/app/types/app/code-tables/email-reference";
import { PartyType } from "../app/shared/party-type";
import { PartyAssociationRole } from "../app/shared/party-association-role";

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
    | Array<HwcrOutcomeActionedBy>
    | Array<Drug>
    | Array<DrugMethod>
    | Array<DrugRemainingOutcome>
    | Array<Equipment>
    | Array<Discharge>
    | Array<NonCompliance>
    | Array<Sector>
    | Array<Schedule>
    | Array<GirType>
    | Array<ScheduleSectorXref>
    | Array<ComplaintMethodReceivedType>
    | Array<DecisionType>
    | Array<TeamType>
    | Array<IPMAuthCategoryType>
    | Array<CaseLocationType>
    | Array<EquipmentStatus>
    | Array<ParkArea>
    | Array<EmailReference>
    | Array<PartyType>
    | Array<PartyAssociationRole>;

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
  "hwcr-outcome-actioned-by-codes": Array<HwcrOutcomeActionedBy>;
  drugs: Array<Drug>;
  "drug-methods": Array<DrugMethod>;
  "drug-remaining-outcomes": Array<DrugRemainingOutcome>;
  equipment: Array<Equipment>;
  "gir-type": Array<GirType>;
  discharge: Array<Discharge>;
  "non-compliance": Array<NonCompliance>;
  sector: Array<Sector>;
  schedule: Array<Schedule>;
  "schedule-sector-type": Array<ScheduleSectorXref>;
  "decision-type": Array<DecisionType>;
  team: Array<TeamType>;
  "complaint-method-received-codes": Array<ComplaintMethodReceivedType>;
  "lead-agency": Array<Agency>;
  "assessment-cat1-type": Array<AssessmentType>;
  "ipm-auth-category": Array<IPMAuthCategoryType>;
  "case-location-type": Array<CaseLocationType>;
  "equipment-status": Array<EquipmentStatus>;
  "park-area": Array<ParkArea>;
  "email-reference": Array<EmailReference>;
  "party-type": Array<PartyType>;
  "party-association-role": Array<PartyAssociationRole>;
}
