import { Module } from "@nestjs/common";
import { GeoOrganizationUnitCodeService } from "./geo_organization_unit_code.service";
import { GeoOrganizationUnitCodeResolver } from "./geo_organization_unit_code.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";

@Module({
  imports: [PrismaModuleShared],
  providers: [GeoOrganizationUnitCodeResolver, GeoOrganizationUnitCodeService],
})
export class GeoOrganizationUnitCodeModule {}
