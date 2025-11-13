import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { geo_org_unit_type_code } from "prisma/shared/generated/geo_org_unit_type_code";
import { GeoOrgUnitTypeCode } from "./dto/geo_org_unit_type_code";

@Injectable()
export class GeoOrgUnitTypeCodeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(GeoOrgUnitTypeCodeService.name);

  async findAll() {
    const prismaGeoOrgUnitTypeCodes = await this.prisma.geo_org_unit_type_code.findMany({
      select: {
        geo_org_unit_type_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
      orderBy: {
        display_order: "asc",
      },
    });

    return this.mapper.mapArray<geo_org_unit_type_code, GeoOrgUnitTypeCode>(
      prismaGeoOrgUnitTypeCodes as Array<geo_org_unit_type_code>,
      "geo_org_unit_type_code",
      "GeoOrgUnitTypeCode",
    );
  }
}
