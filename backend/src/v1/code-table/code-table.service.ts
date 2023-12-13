import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

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

  getCodeTableByName = async (table: string): Promise<BaseCodeTable[]> => {
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
        const builder = this._organizationUnitRepository
          .createQueryBuilder("organization_unit")
          .leftJoinAndSelect(
            "organization_unit.geo_org_unit_type_code",
            "organization_unit_type"
          ).orderBy("long_description");

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
          }) => {
            let table: PersonComplaintType = {
              personComplaintType: person_complaint_xref_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
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
}
