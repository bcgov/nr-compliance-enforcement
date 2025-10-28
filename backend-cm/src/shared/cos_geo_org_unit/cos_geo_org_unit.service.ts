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

  async findAll() {
    const rawResults = await this.prisma.$queryRaw<CosGeoOrgUnitRaw[]>`
      SELECT 
        region_code,
        region_name,
        zone_code,
        zone_name,
        offloc_code,
        offloc_name,
        area_code,
        area_name,
        administrative_office_ind
      FROM cos_geo_org_unit_flat_mvw
    `;

    return this.mapper.mapArray<CosGeoOrgUnitRaw, CosGeoOrgUnit>(rawResults, "CosGeoOrgUnitRaw", "CosGeoOrgUnit");
  }
}
