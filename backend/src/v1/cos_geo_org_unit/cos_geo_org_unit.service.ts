import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CosGeoOrgUnit } from "./entities/cos_geo_org_unit.entity";

@Injectable()
export class CosGeoOrgUnitService {
  constructor(
    @InjectRepository(CosGeoOrgUnit)
    private cosGeoOrgUnitRepository: Repository<CosGeoOrgUnit>
  ) {}

  async findAll(): Promise<CosGeoOrgUnit[]> {
    return this.cosGeoOrgUnitRepository.find();
  }

  async findOne(id: any): Promise<CosGeoOrgUnit> {
    return this.cosGeoOrgUnitRepository.findOneOrFail(id);
  }

  async findByRegionCode(regionCode: string): Promise<CosGeoOrgUnit[]> {
    return this.cosGeoOrgUnitRepository.findBy({
      region_code: regionCode,
    });
  }

  async findByRegionName(regionName: string): Promise<CosGeoOrgUnit[]> {
    return this.cosGeoOrgUnitRepository.findBy({
      region_name: regionName,
    });
  }

  async findByZoneCode(zoneCode: string): Promise<CosGeoOrgUnit[]> {
    return this.cosGeoOrgUnitRepository.findBy({
      zone_code: zoneCode,
    });
  }

  async findByZoneName(zoneName: string): Promise<CosGeoOrgUnit[]> {
    return this.cosGeoOrgUnitRepository.findBy({
      zone_name: zoneName,
    });
  }

  async findByOfficeLocationCode(
    officeLocationCode: string
  ): Promise<CosGeoOrgUnit[]> {
    return this.cosGeoOrgUnitRepository.findBy({
      office_location_code: officeLocationCode,
    });
  }

  async findByOfficeLocationName(
    officeLocationName: string
  ): Promise<CosGeoOrgUnit[]> {
    return this.cosGeoOrgUnitRepository.findBy({
      office_location_code: officeLocationName,
    });
  }

  async findByAreaCode(areaCode: string): Promise<CosGeoOrgUnit> {
    return this.cosGeoOrgUnitRepository.findOneBy({
      area_code: areaCode,
    });
  }

  async findByAreaName(areaName: string): Promise<CosGeoOrgUnit> {
    return this.cosGeoOrgUnitRepository.findOneBy({
      area_code: areaName,
    });
  }
}
