import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { geo_organization_unit_code } from "prisma/shared/generated/geo_organization_unit_code";
import { GeoOrganizationUnitCode } from "./dto/geo_organization_unit_code";

@Injectable()
export class GeoOrganizationUnitCodeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(GeoOrganizationUnitCodeService.name);

  async findAll() {
    const prismaGeoOrgUnitCodes = await this.prisma.geo_organization_unit_code.findMany({
      select: {
        geo_organization_unit_code: true,
        short_description: true,
        long_description: true,
        effective_date: true,
        expiry_date: true,
        geo_org_unit_type_code: true,
        administrative_office_ind: true,
      },
      orderBy: {
        long_description: "asc",
      },
    });

    return this.mapper.mapArray<geo_organization_unit_code, GeoOrganizationUnitCode>(
      prismaGeoOrgUnitCodes as Array<geo_organization_unit_code>,
      "geo_organization_unit_code",
      "GeoOrganizationUnitCode",
    );
  }
}
