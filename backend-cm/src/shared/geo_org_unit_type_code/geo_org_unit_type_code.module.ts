import { Module } from "@nestjs/common";
import { GeoOrgUnitTypeCodeService } from "./geo_org_unit_type_code.service";
import { GeoOrgUnitTypeCodeResolver } from "./geo_org_unit_type_code.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";

@Module({
  imports: [PrismaModuleShared],
  providers: [GeoOrgUnitTypeCodeResolver, GeoOrgUnitTypeCodeService],
})
export class GeoOrgUnitTypeCodeModule {}
