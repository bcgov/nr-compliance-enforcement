import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";

import BaseCodeTable, {
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
  Zone,
  Community,
  ReportedBy,
  Equipment,
  GirType,
  IPMAuthCategory,
} from "../../types/models/code-tables";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { AttractantCode } from "../attractant_code/entities/attractant_code.entity";
import { ComplaintStatusCode } from "../complaint_status_code/entities/complaint_status_code.entity";
import { HwcrComplaintNatureCode } from "../hwcr_complaint_nature_code/entities/hwcr_complaint_nature_code.entity";
import { GeoOrgUnitTypeCode } from "../geo_org_unit_type_code/entities/geo_org_unit_type_code.entity";
import { GeoOrganizationUnitCode } from "../geo_organization_unit_code/entities/geo_organization_unit_code.entity";
import { PersonComplaintXrefCode } from "../person_complaint_xref_code/entities/person_complaint_xref_code.entity";
import { SpeciesCode } from "../species_code/entities/species_code.entity";
import { CosGeoOrgUnit } from "../cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { ComplaintTypeCode } from "../complaint_type_code/entities/complaint_type_code.entity";
import { ReportedByCode } from "../reported_by_code/entities/reported_by_code.entity";
import { Justification } from "src/types/models/code-tables/justification";
import { AssessmentType } from "src/types/models/code-tables/assessment-type";
import { PreventionType } from "src/types/models/code-tables/prevention-type";
import { Sex } from "src/types/models/code-tables/sex";
import { Age } from "src/types/models/code-tables/age";
import { ThreatLevel } from "src/types/models/code-tables/threat-level";
import { ConflictHistory } from "src/types/models/code-tables/conflict-history";
import { EarTag } from "src/types/models/code-tables/ear-tag";
import { Drug } from "src/types/models/code-tables/drug";
import { DrugMethod } from "src/types/models/code-tables/drug-method";
import { DrugRemainingOutcome } from "src/types/models/code-tables/drug-remaining-outcome";
import { WildlifeComplaintOutcome } from "src/types/models/code-tables/wildlfe-complaint-outcome";
import { get } from "../../external_api/shared_data";
import { GirTypeCode } from "../gir_type_code/entities/gir_type_code.entity";
import { Schedule } from "src/types/models/code-tables/schedule";
import { SectorCode } from "src/types/models/code-tables/sector-code";
import { Discharge } from "src/types/models/code-tables/discharge";
import { NonCompliance } from "src/types/models/code-tables/non-compliance";
import { DecisionType } from "src/types/models/code-tables/decision-type";
import { TeamCode } from "../team_code/entities/team_code.entity";
import { TeamType } from "src/types/models/code-tables/team-type";
import { CompMthdRecvCdAgcyCdXref } from "../comp_mthd_recv_cd_agcy_cd_xref/entities/comp_mthd_recv_cd_agcy_cd_xref";
import { ComplaintMethodReceivedType } from "src/types/models/code-tables/complaint-method-received-type";
import { ScheduleSectorXref } from "src/types/models/code-tables/schedule-sector-xref";
import { CaseLocationCode } from "src/types/models/code-tables/case-location-code";
import { ViolationAgencyXref } from "../violation_agency_xref/entities/violation_agency_entity_xref";
import { EquipmentStatus } from "src/types/models/code-tables/equipment-status";
import { HwcrOutcomeActionedBy } from "src/types/models/code-tables/hwcr-outcome-actioned-by";
import { EmailReference } from "../email_reference/entities/email_reference.entity";

@Injectable()
export class CodeTableService {
  private readonly logger = new Logger(CodeTableService.name);

  @InjectRepository(AgencyCode)
  private readonly _agencyRepository: Repository<AgencyCode>;
  @InjectRepository(AttractantCode)
  private readonly _attractantRepository: Repository<AttractantCode>;
  @InjectRepository(ComplaintStatusCode)
  private readonly _complaintStatusRepository: Repository<ComplaintStatusCode>;
  @InjectRepository(HwcrComplaintNatureCode)
  private readonly _natureOfComplaintRepository: Repository<HwcrComplaintNatureCode>;
  @InjectRepository(GeoOrgUnitTypeCode)
  private readonly _organizationUnitTypeRepository: Repository<GeoOrgUnitTypeCode>;
  @InjectRepository(GeoOrganizationUnitCode)
  private readonly _organizationUnitRepository: Repository<GeoOrganizationUnitCode>;
  @InjectRepository(PersonComplaintXrefCode)
  private readonly _personComplaintTypeRepository: Repository<PersonComplaintXrefCode>;
  @InjectRepository(SpeciesCode)
  private readonly _speciesRepository: Repository<SpeciesCode>;
  @InjectRepository(ViolationAgencyXref)
  private readonly _violationAgencyXrefRepository: Repository<ViolationAgencyXref>;
  @InjectRepository(CosGeoOrgUnit)
  private readonly _cosOrganizationUnitRepository: Repository<CosGeoOrgUnit>;
  @InjectRepository(ComplaintTypeCode)
  private readonly _complaintTypetRepository: Repository<ComplaintTypeCode>;
  @InjectRepository(GirTypeCode)
  private readonly _girTypeCodeRepository: Repository<GirTypeCode>;
  @InjectRepository(ReportedByCode)
  private readonly _reportedByRepository: Repository<ReportedByCode>;
  @InjectRepository(TeamCode)
  private readonly _teamCodeRepository: Repository<TeamCode>;
  @InjectRepository(CompMthdRecvCdAgcyCdXref)
  private readonly _compMthdRecvCdAgcyCdXrefRepository: Repository<CompMthdRecvCdAgcyCdXref>;
  @InjectRepository(EmailReference)
  private readonly _emailReferenceRepository: Repository<EmailReference>;

  getCodeTableByName = async (table: string, token?: string): Promise<BaseCodeTable[]> => {
    this.logger.debug("in code table: " + JSON.stringify(table));
    switch (table) {
      case "agency": {
        const data = await this._agencyRepository.find({ order: { display_order: "ASC" } });
        let results = data.map(
          ({ agency_code, short_description, long_description, display_order, active_ind, external_agency_ind }) => {
            let table: Agency = {
              agency: agency_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind,
              externalAgencyInd: external_agency_ind,
            };
            return table;
          },
        );

        return results;
      }
      case "attractant": {
        const data = await this._attractantRepository.find({ order: { display_order: "ASC" } });
        let results = data.map(
          ({ attractant_code, short_description, long_description, display_order, active_ind }) => {
            let table: Attractant = {
              attractant: attractant_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind,
            };
            return table;
          },
        );
        return results;
      }
      case "complaint-status": {
        const data = await this._complaintStatusRepository.find({ order: { display_order: "ASC" } });
        let results = data.map(
          ({
            complaint_status_code,
            short_description,
            long_description,
            display_order,
            active_ind,
            manually_assignable_ind,
          }) => {
            let table: ComplaintStatus = {
              complaintStatus: complaint_status_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind,
              manuallyAssignableInd: manually_assignable_ind,
            };
            return table;
          },
        );
        return results;
      }
      case "nature-of-complaint": {
        const data = await this._natureOfComplaintRepository.find({ order: { display_order: "ASC" } });
        let results = data.map(
          ({ hwcr_complaint_nature_code, short_description, long_description, display_order, active_ind }) => {
            let table: NatureOfComplaint = {
              natureOfComplaint: hwcr_complaint_nature_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind,
            };
            return table;
          },
        );
        return results;
      }
      case "organization-unit-type": {
        const data = await this._organizationUnitTypeRepository.find({ order: { display_order: "ASC" } });
        let results = data.map(
          ({ geo_org_unit_type_code, short_description, long_description, display_order, active_ind }) => {
            let table: OrganizationUnitType = {
              organizationUnitType: geo_org_unit_type_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind,
            };
            return table;
          },
        );
        return results;
      }
      case "organization-unit": {
        let builder: SelectQueryBuilder<GeoOrganizationUnitCode>;
        builder = this._organizationUnitRepository
          .createQueryBuilder("organization_unit")
          .leftJoinAndSelect("organization_unit.geo_org_unit_type_code", "organization_unit_type")
          .orderBy("organization_unit.long_description", "ASC");

        const data = await builder.getMany();

        let results = data.map(
          ({
            geo_organization_unit_code,
            short_description,
            long_description,
            geo_org_unit_type_code: organizationUnitType,
          }) => {
            let table: OrganizationUnit = {
              organizationUnit: geo_organization_unit_code,
              shortDescription: short_description,
              longDescription: long_description,
            };

            if (organizationUnitType) {
              const { geo_org_unit_type_code } = organizationUnitType;
              return {
                ...table,
                organizationUnitType: geo_org_unit_type_code,
              };
            }
            return table;
          },
        );
        return results;
      }
      case "person-complaint": {
        const data = await this._personComplaintTypeRepository.find({ order: { display_order: "ASC" } });
        let results = data.map(
          ({ person_complaint_xref_code, short_description, long_description, display_order, active_ind }) => {
            let table: PersonComplaintType = {
              personComplaintType: person_complaint_xref_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind,
            };
            return table;
          },
        );
        return results;
      }
      case "species": {
        const data = await this._speciesRepository.find({ order: { display_order: "ASC" } });
        let results = data.map(
          ({
            species_code,
            short_description,
            long_description,
            display_order,
            active_ind,
            legacy_code,
            large_carnivore_ind,
          }) => {
            let table: Species = {
              species: species_code,
              legacy: legacy_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind,
              isLargeCarnivore: large_carnivore_ind,
            };
            return table;
          },
        );
        return results;
      }
      case "violation": {
        const data = await this._violationAgencyXrefRepository.find({
          order: {
            violation_code: {
              display_order: "ASC",
            },
          },
        });
        let results = data.map(({ violation_code, agency_code, active_ind }) => {
          let table: Violation = {
            violation: violation_code.violation_code,
            shortDescription: violation_code.short_description,
            longDescription: violation_code.long_description,
            displayOrder: violation_code.display_order,
            agencyCode: agency_code.agency_code,
            isActive: active_ind,
          };
          return table;
        });
        return results;
      }
      case "complaint-type": {
        const data = await this._complaintTypetRepository.find({ order: { display_order: "ASC" } });
        let results = data.map(
          ({ complaint_type_code, short_description, long_description, display_order, active_ind }) => {
            let table: ComplaintType = {
              complaintType: complaint_type_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind,
            };
            return table;
          },
        );
        return results;
      }
      case "reported-by": {
        const data = await this._reportedByRepository.find({ order: { display_order: "ASC" } });
        let results = data.map(
          ({ reported_by_code, short_description, long_description, display_order, active_ind }) => {
            let table: ReportedBy = {
              reportedBy: reported_by_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind,
            };
            return table;
          },
        );
        return results;
      }
      case "justification": {
        const { data } = await get(token, {
          query:
            "{inactionJustificationCodes{inactionJustificationCode agencyCode shortDescription longDescription displayOrder activeIndicator}}",
        });
        const justificationCodes = data.inactionJustificationCodes.map(
          ({ inactionJustificationCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: Justification = {
              justification: inactionJustificationCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return justificationCodes;
      }
      case "assessment-type": {
        const { data } = await get(token, {
          query:
            "{HWCRAssessmentActions{actionTypeCode actionCode displayOrder activeIndicator shortDescription longDescription}}",
        });
        const assessmentTypeCodes = data.HWCRAssessmentActions.map(
          ({ actionCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: AssessmentType = {
              assessmentType: actionCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return assessmentTypeCodes;
      }
      case "prevention-type": {
        const { data } = await get(token, {
          query:
            "{HWCRPreventionActions{actionTypeCode actionCode displayOrder activeIndicator shortDescription longDescription}}",
        });
        const preventionTypeCodes = data.HWCRPreventionActions.map(
          ({ actionTypeCode, actionCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: PreventionType = {
              agencyCode: actionTypeCode === "COSPRV&EDU" ? "COS" : "PARKS", //Might need to be converted to a switch in the future
              preventionType: actionCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return preventionTypeCodes;
      }
      case "sex": {
        const { data } = await get(token, {
          query: "{sexCodes{sexCode shortDescription longDescription displayOrder activeIndicator}}",
        });
        const results = data.sexCodes.map(
          ({ sexCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: Sex = {
              sex: sexCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return results;
      }
      case "age": {
        const { data } = await get(token, {
          query: "{ageCodes{ageCode shortDescription longDescription displayOrder activeIndicator}}",
        });
        const results = data.ageCodes.map(
          ({ ageCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: Age = {
              age: ageCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return results;
      }
      case "threat-level": {
        const { data } = await get(token, {
          query: "{threatLevelCodes{threatLevelCode shortDescription longDescription displayOrder activeIndicator}}",
        });
        const results = data.threatLevelCodes.map(
          ({ threatLevelCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: ThreatLevel = {
              threatLevel: threatLevelCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return results;
      }
      case "conflict-history": {
        const { data } = await get(token, {
          query:
            "{conflictHistoryCodes{conflictHistoryCode shortDescription longDescription displayOrder activeIndicator}}",
        });
        const results = data.conflictHistoryCodes.map(
          ({ conflictHistoryCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: ConflictHistory = {
              conflictHistory: conflictHistoryCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return results;
      }
      case "ear-tag": {
        const { data } = await get(token, {
          query: "{earCodes{earCode shortDescription longDescription displayOrder activeIndicator}}",
        });
        const results = data.earCodes.map(
          ({ earCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: EarTag = {
              earTag: earCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return results;
      }
      case "drugs": {
        const { data } = await get(token, {
          query: "{drugCodes{drugCode shortDescription longDescription displayOrder activeIndicator}}",
        });
        const results = data.drugCodes.map(
          ({ drugCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: Drug = {
              drug: drugCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return results;
      }
      case "drug-methods": {
        const { data } = await get(token, {
          query: "{drugMethodCodes{drugMethodCode shortDescription longDescription displayOrder activeIndicator}}",
        });
        const results = data.drugMethodCodes.map(
          ({ drugMethodCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: DrugMethod = {
              method: drugMethodCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return results;
      }
      case "drug-remaining-outcomes": {
        const { data } = await get(token, {
          query:
            "{drugRemainingOutcomeCodes{drugRemainingOutcomeCode shortDescription longDescription displayOrder activeIndicator}}",
        });
        const results = data.drugRemainingOutcomeCodes.map(
          ({ drugRemainingOutcomeCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: DrugRemainingOutcome = {
              outcome: drugRemainingOutcomeCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return results;
      }
      case "wildlife-outcomes": {
        const { data } = await get(token, {
          query: "{hwcrOutcomeCodes{hwcrOutcomeCode shortDescription longDescription displayOrder activeIndicator}}",
        });
        const results = data.hwcrOutcomeCodes.map(
          ({ hwcrOutcomeCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: WildlifeComplaintOutcome = {
              outcome: hwcrOutcomeCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return results;
      }
      case "hwcr-outcome-actioned-by-codes": {
        const { data } = await get(token, {
          query:
            "{hwcrOutcomeActionedByCodes{hwcrOutcomeActionedByCode shortDescription longDescription displayOrder activeIndicator}}",
        });
        const results = data.hwcrOutcomeActionedByCodes.map(
          ({ hwcrOutcomeActionedByCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: HwcrOutcomeActionedBy = {
              actionedBy: hwcrOutcomeActionedByCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return results;
      }
      case "equipment": {
        const { data } = await get(token, {
          query:
            "{equipmentCodes{equipmentCode shortDescription longDescription displayOrder activeIndicator isTrapIndicator hasQuantityIndicator}}",
        });
        const results = data.equipmentCodes.map(
          ({
            equipmentCode,
            shortDescription,
            longDescription,
            displayOrder,
            activeIndicator,
            isTrapIndicator,
            hasQuantityIndicator,
          }) => {
            const table: Equipment = {
              equipment: equipmentCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
              isTrapIndicator: isTrapIndicator,
              hasQuantityIndicator: hasQuantityIndicator,
            };
            return table;
          },
        );
        return results;
      }
      case "equipment-status": {
        const { data } = await get(token, {
          query:
            "{equipmentStatusCodes{equipmentStatusCode shortDescription longDescription displayOrder activeIndicator}}",
        });
        const results = data.equipmentStatusCodes.map(
          ({ equipmentStatusCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: EquipmentStatus = {
              equipmentStatus: equipmentStatusCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return results;
      }
      case "gir-type": {
        const data = await this._girTypeCodeRepository.find({ order: { display_order: "ASC" } });
        let results = data.map(({ gir_type_code, short_description, long_description, display_order, active_ind }) => {
          let table: GirType = {
            girType: gir_type_code,
            shortDescription: short_description,
            longDescription: long_description,
            displayOrder: display_order,
            isActive: active_ind,
          };
          return table;
        });
        return results;
      }
      case "schedule": {
        const { data } = await get(token, {
          query: "{scheduleCodes{scheduleCode shortDescription longDescription displayOrder activeIndicator}}",
        });
        const results = data.scheduleCodes.map(
          ({ scheduleCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: Schedule = {
              schedule: scheduleCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return results;
      }
      case "sector": {
        const { data } = await get(token, {
          query: "{sectorCodes{sectorCode shortDescription longDescription displayOrder activeIndicator}}",
        });
        const results = data.sectorCodes.map(
          ({ sectorCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: SectorCode = {
              sector: sectorCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return results;
      }
      case "schedule-sector-type": {
        const { data } = await get(token, {
          query: "{scheduleSectorXrefs{scheduleCode sectorCode shortDescription longDescription activeIndicator}}",
        });
        const results = data.scheduleSectorXrefs.map(
          ({ sectorCode, scheduleCode, shortDescription, longDescription, activeIndicator: isActive }) => {
            const table: ScheduleSectorXref = {
              schedule: scheduleCode,
              sector: sectorCode,
              shortDescription,
              longDescription,
              displayOrder: 1,
              isActive,
            };
            return table;
          },
        );
        return results;
      }
      case "discharge": {
        const { data } = await get(token, {
          query: "{ dischargeCodes { dischargeCode shortDescription longDescription displayOrder activeIndicator} }",
        });
        const results = data.dischargeCodes.map(
          ({ dischargeCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: Discharge = {
              discharge: dischargeCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return results;
      }
      case "non-compliance": {
        const { data } = await get(token, {
          query:
            "{nonComplianceCodes{nonComplianceCode shortDescription longDescription displayOrder activeIndicator}}",
        });
        const results = data.nonComplianceCodes.map(
          ({ nonComplianceCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: NonCompliance = {
              nonCompliance: nonComplianceCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return results;
      }
      case "ipm-auth-category": {
        const { data } = await get(token, {
          query:
            "{ipmAuthCategoryCodes{ipmAuthCategoryCode displayOrder activeIndicator shortDescription longDescription}}",
        });
        const ipmAuthCategoryCodes = data.ipmAuthCategoryCodes.map(
          ({ ipmAuthCategoryCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: IPMAuthCategory = {
              ipmAuthCategoryCode: ipmAuthCategoryCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return ipmAuthCategoryCodes;
      }
      case "decision-type": {
        const { data } = await get(token, {
          query:
            "{CEEBDecisionActions{actionTypeCode actionCode displayOrder activeIndicator shortDescription longDescription}}",
        });
        const results = data.CEEBDecisionActions.map(
          ({ actionCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: DecisionType = {
              decisionType: actionCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return results;
      }
      case "team": {
        const data = await this._teamCodeRepository.find({ order: { display_order: "ASC" } });
        let results = data.map(({ team_code, short_description, long_description, display_order, active_ind }) => {
          let table: TeamType = {
            team: team_code,

            shortDescription: short_description,
            longDescription: long_description,
            displayOrder: display_order,
            isActive: active_ind,
          };
          return table;
        });
        return results;
      }
      case "lead-agency": {
        const { data } = await get(token, {
          query: "{agencyCodes{agencyCode shortDescription longDescription displayOrder activeIndicator}}",
        });
        const results = data.agencyCodes.map(
          ({ agencyCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: Agency = {
              agency: agencyCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
              externalAgencyInd: false, // Included in the type but external agencies are only in Natcom, not CM
            };
            return table;
          },
        );
        return results;
      }
      case "assessment-cat1-type": {
        const { data } = await get(token, {
          query:
            "{HWCRAssessmentCat1Actions{actionTypeCode actionCode displayOrder activeIndicator shortDescription longDescription}}",
        });
        const assessmentCat1TypeCodes = data.HWCRAssessmentCat1Actions.map(
          ({ actionCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: AssessmentType = {
              assessmentType: actionCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return assessmentCat1TypeCodes;
      }
      case "case-location-type": {
        const { data } = await get(token, {
          query: "{caseLocationCodes{caseLocationCode shortDescription longDescription displayOrder activeIndicator}}",
        });
        const results = data.caseLocationCodes.map(
          ({ caseLocationCode, shortDescription, longDescription, displayOrder, activeIndicator }) => {
            const table: CaseLocationCode = {
              caseLocationType: caseLocationCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator,
            };
            return table;
          },
        );
        return results;
      }
      case "park-area": {
        const { data } = await get(token, {
          query: "{parkAreas{parkAreaGuid name regionName}}",
        });
        const results = data.parkAreas;
        return results;
      }
      case "email-reference": {
        const data = await this._emailReferenceRepository.find({
          where: { active_ind: true },
          order: { agency_code: "ASC" },
        });
        const emailReferences = data.map(({ agency_code, email_address, geo_organization_unit_code }) => {
          return {
            agencyCode: agency_code,
            emailAddress: email_address,
            geoOrgUnitTypeCode: geo_organization_unit_code,
            shortDescription: "",
            longDescription: "",
          };
        });
        return emailReferences;
      }
    }
  };

  getComplaintMethodReceived = async (agency: string): Promise<ComplaintMethodReceivedType[]> => {
    const whereClause: any = {
      active_ind: true,
    };

    if (agency) {
      whereClause.agency_code = agency;
    }

    const data = await this._compMthdRecvCdAgcyCdXrefRepository.find({
      where: whereClause,
      relations: ["complaint_method_received_code"],
      order: {
        complaint_method_received_code: {
          display_order: "ASC",
        },
      },
    });

    // Map the fields correctly from complaint_method_received_code
    let results = data.map(({ complaint_method_received_code }) => {
      let table: ComplaintMethodReceivedType = {
        complaintMethodReceivedCode: complaint_method_received_code.complaint_method_received_code,
        shortDescription: complaint_method_received_code.short_description,
        longDescription: complaint_method_received_code.long_description,
        displayOrder: complaint_method_received_code.display_order,
        isActive: complaint_method_received_code.active_ind,
      };
      return table;
    });
    return results;
  };

  getOrganizationsByAgency = async (agency: string): Promise<OrganizationCodeTable[]> => {
    const data = await this._cosOrganizationUnitRepository.find();

    const results = data.map(
      ({
        area_code: area,
        area_name: areaName,
        office_location_code: officeLocation,
        office_location_name: officeLocationName,
        region_name: regionName,
        region_code: region,
        zone_name: zoneName,
        zone_code: zone,
      }) => {
        let record: OrganizationCodeTable = {
          area,
          areaName,
          officeLocation,
          officeLocationName,
          regionName,
          region,
          zone,
          zoneName,
        };

        return record;
      },
    );

    return results;
  };

  getRegionsByAgency = async (agency: string): Promise<Array<Sector>> => {
    const data = await this._cosOrganizationUnitRepository
      .createQueryBuilder("cos_geo_org_unit")
      .select(["region_name", "region_code"])
      .distinct(true)
      .orderBy("cos_geo_org_unit.region_name", "ASC")
      .getRawMany();

    const results = data.map(({ region_name: name, region_code: code }) => {
      let record: Sector = {
        code,
        name,
      };
      return record;
    });

    return results;
  };

  getZonesByAgency = async (agency: string): Promise<Array<Zone>> => {
    const data = await this._cosOrganizationUnitRepository
      .createQueryBuilder("cos_geo_org_unit")
      .select(["zone_name", "zone_code", "region_code"])
      .distinct(true)
      .orderBy("cos_geo_org_unit.zone_name", "ASC")
      .getRawMany();

    const results = data.map(({ zone_name: name, zone_code: code, region_code: region }) => {
      let record: Zone = {
        code,
        name,
        region,
      };
      return record;
    });

    return results;
  };

  getCommunitiesByAgency = async (agency: string): Promise<Array<Community>> => {
    const data = await this._cosOrganizationUnitRepository
      .createQueryBuilder("cos_geo_org_unit")
      .select(["area_name", "area_code", "zone_code", "region_code"])
      .where("area_code IS NOT NULL") //added to exclude office locations that don't have areas/communities e.g. COSHQ
      .distinct(true)
      .orderBy("cos_geo_org_unit.area_name", "ASC")
      .getRawMany();

    const results = data.map(({ area_name: name, area_code: code, zone_code: zone, region_code: region }) => {
      let record: Community = {
        code,
        name,
        zone,
        region,
      };
      return record;
    });

    return results;
  };

  getComplaintStatusCodeByStatus = async (input: string): Promise<ComplaintStatusCode> => {
    const result = await this._complaintStatusRepository
      .createQueryBuilder("status")
      .where("status.complaint_status_code = :status", { status: input })
      .getOne();

    return result;
  };
}
