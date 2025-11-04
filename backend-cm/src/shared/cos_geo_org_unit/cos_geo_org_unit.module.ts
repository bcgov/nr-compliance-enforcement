import { Module } from "@nestjs/common";
import { CosGeoOrgUnitService } from "./cos_geo_org_unit.service";
import { CosGeoOrgUnitResolver } from "./cos_geo_org_unit.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";

@Module({
  imports: [PrismaModuleShared],
  providers: [CosGeoOrgUnitResolver, CosGeoOrgUnitService],
  exports: [CosGeoOrgUnitService],
})
export class CosGeoOrgUnitModule {}
