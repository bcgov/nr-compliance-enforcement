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
} from "../../types/models/code-tables";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { AttractantCode } from "../attractant_code/entities/attractant_code.entity";
import { ComplaintStatusCode } from "../complaint_status_code/entities/complaint_status_code.entity";
import { HwcrComplaintNatureCode } from "../hwcr_complaint_nature_code/entities/hwcr_complaint_nature_code.entity";
import { GeoOrgUnitTypeCode } from "../geo_org_unit_type_code/entities/geo_org_unit_type_code.entity";
import { GeoOrganizationUnitCode } from "../geo_organization_unit_code/entities/geo_organization_unit_code.entity";
import { PersonComplaintXrefCode } from "../person_complaint_xref_code/entities/person_complaint_xref_code.entity";
import { SpeciesCode } from "../species_code/entities/species_code.entity";
import { ViolationCode } from "../violation_code/entities/violation_code.entity";
import { CosGeoOrgUnit } from "../cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { ComplaintTypeCode } from "../complaint_type_code/entities/complaint_type_code.entity";
import { ReportedByCode } from "../reported_by_code/entities/reported_by_code.entity";
import { Justification } from "src/types/models/code-tables/justification";
import { AssessmentType } from "src/types/models/code-tables/assessment-type";
import { PreventEducationAction } from "src/types/models/code-tables/prevent-education-action";
import { Sex } from "src/types/models/code-tables/sex";
import { Age } from "src/types/models/code-tables/age";
import { ThreatLevel } from "src/types/models/code-tables/threat-level";
import { ConflictHistory } from "src/types/models/code-tables/conflict-history";
import { EarTag } from "src/types/models/code-tables/ear-tag";
import { Drug } from "src/types/models/code-tables/drug";
import { DrugMethod } from "src/types/models/code-tables/drug-method";
import { DrugRemainingOutcome } from "src/types/models/code-tables/drug-remaining-outcome";
import { WildlifeComplaintOutcome } from "src/types/models/code-tables/wildlfe-complaint-outcome";
import { get } from "../../external_api/case_management";

@Injectable()
export class CodeTableService {
  private readonly logger = new Logger(CodeTableService.name);

  @InjectRepository(AgencyCode)
  private _agencyRepository: Repository<AgencyCode>;
  @InjectRepository(AttractantCode)
  private _attractantRepository: Repository<AttractantCode>;
  @InjectRepository(ComplaintStatusCode)
  private _complaintStatusRepository: Repository<ComplaintStatusCode>;
  @InjectRepository(HwcrComplaintNatureCode)
  private _natureOfComplaintRepository: Repository<HwcrComplaintNatureCode>;
  @InjectRepository(GeoOrgUnitTypeCode)
  private _organizationUnitTypeRepository: Repository<GeoOrgUnitTypeCode>;
  @InjectRepository(GeoOrganizationUnitCode)
  private _organizationUnitRepository: Repository<GeoOrganizationUnitCode>;
  @InjectRepository(PersonComplaintXrefCode)
  private _personComplaintTypeRepository: Repository<PersonComplaintXrefCode>;
  @InjectRepository(SpeciesCode)
  private _speciesRepository: Repository<SpeciesCode>;
  @InjectRepository(ViolationCode)
  private _violationsRepository: Repository<ViolationCode>;
  @InjectRepository(CosGeoOrgUnit)
  private _cosOrganizationUnitRepository: Repository<CosGeoOrgUnit>;
  @InjectRepository(ComplaintTypeCode)
  private _complaintTypetRepository: Repository<ComplaintTypeCode>;
  @InjectRepository(ReportedByCode)
  private _reportedByRepository: Repository<ReportedByCode>;

  getCodeTableByName = async (table: string, token?: string): Promise<BaseCodeTable[]> => {
    this.logger.debug("in code table: " + JSON.stringify(table));
    switch (table) {
      case "agency": {
        const data = await this._agencyRepository.find(
          {order: {display_order: "ASC"}}
        );
        let results = data.map(
          ({
            agency_code,
            short_description,
            long_description,
            display_order,
            active_ind,
          }) => {
            let table: Agency = {
              agency: agency_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind,
            };
            return table;
          }
        );

        return results;
      }
      case "attractant": {
        const data = await this._attractantRepository.find(
          {order: {display_order: "ASC"}}
        );
        let results = data.map(
          ({
            attractant_code,
            short_description,
            long_description,
            display_order,
            active_ind,
          }) => {
            let table: Attractant = {
              attractant: attractant_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind,
            };
            return table;
          }
        );
        return results;
      }
      case "complaint-status": {
        const data = await this._complaintStatusRepository.find(
          {order: {display_order: "ASC"}}
        );
        let results = data.map(
          ({
            complaint_status_code,
            short_description,
            long_description,
            display_order,
            active_ind,
          }) => {
            let table: ComplaintStatus = {
              complaintStatus: complaint_status_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind,
            };
            return table;
          }
        );
        return results;
      }
      case "nature-of-complaint": {
        const data = await this._natureOfComplaintRepository.find(
          {order: {display_order: "ASC"}}
        );
        let results = data.map(
          ({
            hwcr_complaint_nature_code,
            short_description,
            long_description,
            display_order,
            active_ind,
          }) => {
            let table: NatureOfComplaint = {
              natureOfComplaint: hwcr_complaint_nature_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind,
            };
            return table;
          }
        );
        return results;
      }
      case "organization-unit-type": {
        const data = await this._organizationUnitTypeRepository.find(
          {order: {display_order: "ASC"}}
        );
        let results = data.map(
          ({
            geo_org_unit_type_code,
            short_description,
            long_description,
            display_order,
            active_ind,
          }) => {
            let table: OrganizationUnitType = {
              organizationUnitType: geo_org_unit_type_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind,
            };
            return table;
          }
        );
        return results;
      }
      case "organization-unit": {
        let builder: SelectQueryBuilder<GeoOrganizationUnitCode>;
        builder = this._organizationUnitRepository
          .createQueryBuilder("organization_unit")
          .leftJoinAndSelect(
            "organization_unit.geo_org_unit_type_code",
            "organization_unit_type"
          ).orderBy("organization_unit.long_description", "ASC");

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
          }
        );
        return results;
      }
      case "person-complaint": {
        const data = await this._personComplaintTypeRepository.find(
          {order: {display_order: "ASC"}}
        );
        let results = data.map(
          ({
            person_complaint_xref_code,
            short_description,
            long_description,
            display_order,
            active_ind,
          }) => {
            let table: PersonComplaintType = {
              personComplaintType: person_complaint_xref_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind
            };
            return table;
          }
        );
        return results;
      }
      case "species": {
        const data = await this._speciesRepository.find(
          {order: {display_order: "ASC"}}
        );
        let results = data.map(
          ({
            species_code,
            short_description,
            long_description,
            display_order,
            active_ind,
            legacy_code,
          }) => {
            let table: Species = {
              species: species_code,
              legacy: legacy_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind,
            };
            return table;
          }
        );
        return results;
      }
      case "violation": {
        const data = await this._violationsRepository.find(
          {order: {display_order: "ASC"}}
        );
        let results = data.map(
          ({
            violation_code,
            short_description,
            long_description,
            display_order,
            active_ind,
          }) => {
            let table: Violation = {
              violation: violation_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind,
            };
            return table;
          }
        );
        return results;
      }
      case "complaint-type": {
        const data = await this._complaintTypetRepository.find(
          {order: {display_order: "ASC"}}
        );
        let results = data.map(
          ({
            complaint_type_code,
            short_description,
            long_description,
            display_order,
            active_ind,
          }) => {
            let table: ComplaintType = {
              complaintType: complaint_type_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind,
            };
            return table;
          }
        );
        return results;
      }
      case "reported-by": {
        const data = await this._reportedByRepository.find(
          {order: {display_order: "ASC"}}
        );
        let results = data.map(
          ({
            reported_by_code,
            short_description,
            long_description,
            display_order,
            active_ind,
          }) => {
            let table: ReportedBy = {
              reportedBy: reported_by_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind,
            };
            return table;
          }
        );
        return results;
      }
      case "justification": {
        const { data } = await get(token, { 
          query : "{inactionJustificationTypes{actionJustificationCode agencyCode shortDescription longDescription displayOrder activeIndicator}}"
        });
        const justificationCodes = data.inactionJustificationTypes.map(
          ({
            actionJustificationCode,
            shortDescription,
            longDescription,
            displayOrder,
            activeIndicator
          }) => {
            const table: Justification = {
              justification: actionJustificationCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator
            };
            return table;
          }
        );        
        return justificationCodes;
      }
      case "assessment-type": {
        const { data } = await get(token, { 
          query : "{HWCRAssessmentActions{actionTypeCode actionCode displayOrder activeIndicator shortDescription longDescription}}"
        });
        const assessmentTypeCodes = data.HWCRAssessmentActions.map(
          ({
            actionCode,
            shortDescription,
            longDescription,
            displayOrder,
            activeIndicator
          }) => {
            const table: AssessmentType = {
              assessmentType: actionCode,
              shortDescription: shortDescription,
              longDescription: longDescription,
              displayOrder: displayOrder,
              isActive: activeIndicator
            };
            return table;
          }
        );
        return assessmentTypeCodes;
      }
      case "prevent-education-action": {
        const data: PreventEducationAction[] = [
          { action: "Provided safety information to the public",
            shortDescription: "Provided safety information to the public",
            longDescription: "Provided safety information to the public",
            displayOrder: 1,
            isActive: true,
          },
          { action: "Provided attractant management and husbandry information to the public",
            shortDescription: "Provided attractant management and husbandry information to the public",
            longDescription: "Provided attractant management and husbandry information to the public",
            displayOrder: 2,
            isActive: true,
          },
          { action: "Conducted media release to educate the community",
            shortDescription: "Conducted media release to educate the community",
            longDescription: "Conducted media release to educate the community",
            displayOrder: 3,
            isActive: true,
          },
          { action: "Contacted WildSafeBC or local interest group to deliver education to the public",
            shortDescription: "Contacted WildSafeBC or local interest group to deliver education to the public",
            longDescription: "Contacted WildSafeBC or local interest group to deliver education to the public",
            displayOrder: 4,
            isActive: true,
          },
          { action: "Contacted bylaw to assist with managing attractants",
            shortDescription: "Contacted bylaw to assist with managing attractants",
            longDescription: "Contacted bylaw to assist with managing attractants",
            displayOrder: 5,
            isActive: true,
          },
        ];
        return data;
      }
      case "sex": {
        const { data } = await get(token, { 
          query : "{getAllSexCodes{sex_code short_description long_description display_order active_ind}}"
        });
        const results = data.getAllSexCodes.map(
          ({
            sex_code,
            short_description,
            long_description,
            display_order
          }) => {
            const table: Sex = {
              sex: sex_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order
            };
            return table;
          }
        );
        return results;
      }
      case "age": {
        const { data } = await get(token, { 
          query : "{getAllAgeCodes{age_code short_description long_description display_order active_ind}}"
        });
        const results = data.getAllAgeCodes.map(
          ({
            age_code,
            short_description,
            long_description,
            display_order
          }) => {
            const table: Age = {
              age: age_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order
            };
            return table;
          }
        );
        return results;
      }
      case "threat-level": { 
        const { data } = await get(token, { 
          query : "{getAllThreatLevelCodes{threat_level_code short_description long_description display_order active_ind}}"
        });
        const results = data.getAllThreatLevelCodes.map(
          ({
            threat_level_code,
            short_description,
            long_description,
            display_order
          }) => {
            const table: ThreatLevel = {
              threatLevel: threat_level_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order
            };
            return table;
          }
        );
        return results;
      }
      case "conflict-history": {
        const { data } = await get(token, { 
          query : "{getAllConflictHistoryCodes{conflict_history_code short_description long_description display_order active_ind}}"
        });
        const results = data.getAllConflictHistoryCodes.map(
          ({
            conflict_history_code,
            short_description,
            long_description,
            display_order
          }) => {
            const table: ConflictHistory = {
              conflictHistory: conflict_history_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order
            };
            return table;
          }
        );
        return results;
      }
      case "ear-tag": {
        const { data } = await get(token, { 
          query : "{getAllEarCodes{ear_code short_description long_description display_order active_ind}}"
        });
        const results = data.getAllEarCodes.map(
          ({
            ear_code,
            short_description,
            long_description,
            display_order
          }) => {
            const table: EarTag = {
              earTag: ear_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order
            };
            return table;
          }
        );
        return results;
      }
      case "drugs": {
        const { data } = await get(token, { 
          query : "{getAllDrugCodes{drug_code short_description long_description display_order active_ind}}"
        });
        const results = data.getAllDrugCodes.map(
          ({
            drug_code,
            short_description,
            long_description,
            display_order
          }) => {
            const table: Drug = {
              drug: drug_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order
            };
            return table;
          }
        );
        return results;
      }
      case "drug-methods": {
        const { data } = await get(token, { 
          query : "{getAllDrugMethodCodes{drug_method_code short_description long_description display_order active_ind}}"
        });
        const results = data.getAllDrugMethodCodes.map(
          ({
            drug_method_code,
            short_description,
            long_description,
            display_order
          }) => {
            const table: DrugMethod = {
              method: drug_method_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order
            };
            return table;
          }
        );
        return results;
      }
      case "drug-remaining-outcomes": {
        const { data } = await get(token, { 
          query : "{getAllDrugRemainingOutcomeCodes{drug_remaining_outcome_code short_description long_description display_order active_ind}}"
        });
        const results = data.getAllDrugRemainingOutcomeCodes.map(
          ({
            drug_remaining_outcome_code,
            short_description,
            long_description,
            display_order
          }) => {
            const table: DrugRemainingOutcome = {
              outcome: drug_remaining_outcome_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order
            };
            return table;
          }
        );
        return results;
      }
      case "wildlife-outcomes": {
        const { data } = await get(token, { 
          query : "{getAllHWCROutcomeCodes{hwcr_outcome_code short_description long_description display_order active_ind}}"
        });
        const results = data.getAllHWCROutcomeCodes.map(
          ({
            hwcr_outcome_code,
            short_description,
            long_description,
            display_order
          }) => {
            const table: WildlifeComplaintOutcome = {
              outcome: hwcr_outcome_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order
            };
            return table;
          }
        );
        return results;
      }
      case "equipment": {
        const { data } = await get(token, { 
          query : "{getAllEquipmentCodes{equipment_code short_description long_description display_order active_ind}}"
        });
        const results = data.getAllEquipmentCodes.map(
          ({
            equipment_code,
            short_description,
            long_description,
            display_order
          }) => {
            const table: Equipment = {
              equipment: equipment_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order
            };
            return table;
          }
        );
        return results;
      }
    }
  };

  getOrganizationsByAgency = async (
    agency: string
  ): Promise<OrganizationCodeTable[]> => {
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
      }
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

    const results = data.map(
      ({ zone_name: name, zone_code: code, region_code: region }) => {
        let record: Zone = {
          code,
          name,
          region,
        };
        return record;
      }
    );

    return results;
  };

  getCommunitiesByAgency = async (
    agency: string
  ): Promise<Array<Community>> => {
    const data = await this._cosOrganizationUnitRepository
      .createQueryBuilder("cos_geo_org_unit")
      .select(["area_name", "area_code", "zone_code", "region_code"])
      .distinct(true)
      .orderBy("cos_geo_org_unit.area_name", "ASC")
      .getRawMany();

    const results = data.map(
      ({
        area_name: name,
        area_code: code,
        zone_code: zone,
        region_code: region,
      }) => {
        let record: Community = {
          code,
          name,
          zone,
          region,
        };
        return record;
      }
    );

    return results;
  };

  getComplaintStatusCodeByStatus = async (
    input: string
  ): Promise<ComplaintStatusCode> => {
    const result = await this._complaintStatusRepository
      .createQueryBuilder("status")
      .where("status.complaint_status_code = :status", { status: input })
      .getOne();

      return result;
  };
}
