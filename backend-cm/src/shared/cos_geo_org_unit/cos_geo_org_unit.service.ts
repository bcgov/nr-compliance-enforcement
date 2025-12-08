import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { CosGeoOrgUnit } from "./dto/cos_geo_org_unit";

interface CosGeoOrgUnitRaw {
  region_code: string;
  region_name: string;
  zone_code: string;
  zone_name: string;
  offloc_code: string;
  offloc_name: string;
  area_code: string;
  area_name: string;
  administrative_office_ind: boolean;
}

@Injectable()
export class CosGeoOrgUnitService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(CosGeoOrgUnitService.name);

  async findAll(zoneCode?: string, regionCode?: string, distinctOfficeLocations?: boolean) {
    let whereConditions = [];
    const params: any[] = [];

    if (zoneCode) {
      whereConditions.push(`zone_code = $${params.length + 1}`);
      params.push(zoneCode);
    }

    if (regionCode) {
      whereConditions.push(`region_code = $${params.length + 1}`);
      params.push(regionCode);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    const distinctClause = distinctOfficeLocations ? "DISTINCT ON (offloc_code)" : "";

    const rawResults = await this.prisma.$queryRawUnsafe<CosGeoOrgUnitRaw[]>(
      `SELECT ${distinctClause}
        region_code,
        region_name,
        zone_code,
        zone_name,
        offloc_code,
        offloc_name,
        area_code,
        area_name,
        administrative_office_ind
      FROM shared.cos_geo_org_unit_flat_mvw
      ${whereClause}
      ORDER BY offloc_code ASC`,
      ...params,
    );

    return this.mapper.mapArray<CosGeoOrgUnitRaw, CosGeoOrgUnit>(rawResults, "CosGeoOrgUnitRaw", "CosGeoOrgUnit");
  }

  async searchByNames(
    regionName?: string,
    zoneName?: string,
    areaName?: string,
    officeLocationName?: string,
    distinctOfficeLocations?: boolean,
  ) {
    const whereConditions = [];
    const params: any[] = [];

    if (regionName) {
      whereConditions.push(`region_name ILIKE $${params.length + 1}`);
      params.push(`%${regionName}%`);
    }

    if (zoneName) {
      whereConditions.push(`zone_name ILIKE $${params.length + 1}`);
      params.push(`%${zoneName}%`);
    }

    if (areaName) {
      whereConditions.push(`area_name ILIKE $${params.length + 1}`);
      params.push(`%${areaName}%`);
    }

    if (officeLocationName) {
      whereConditions.push(`offloc_name ILIKE $${params.length + 1}`);
      params.push(`%${officeLocationName}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    const distinctClause = distinctOfficeLocations ? "DISTINCT ON (offloc_code)" : "";

    const rawResults = await this.prisma.$queryRawUnsafe<CosGeoOrgUnitRaw[]>(
      `SELECT ${distinctClause}
        region_code,
        region_name,
        zone_code,
        zone_name,
        offloc_code,
        offloc_name,
        area_code,
        area_name,
        administrative_office_ind
      FROM shared.cos_geo_org_unit_flat_mvw
      ${whereClause}
      ORDER BY offloc_code ASC`,
      ...params,
    );

    return this.mapper.mapArray<CosGeoOrgUnitRaw, CosGeoOrgUnit>(rawResults, "CosGeoOrgUnitRaw", "CosGeoOrgUnit");
  }
}
