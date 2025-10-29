import { Module } from "@nestjs/common";
import { OfficeService } from "./office.service";
import { OfficeResolver } from "./office.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { UserModule } from "../../common/user.module";
import { CosGeoOrgUnitModule } from "../cos_geo_org_unit/cos_geo_org_unit.module";
import { AppUserModule } from "../app_user/app_user.module";

@Module({
  imports: [PrismaModuleShared, UserModule, CosGeoOrgUnitModule, AppUserModule],
  providers: [OfficeResolver, OfficeService],
  exports: [OfficeService],
})
export class OfficeModule {}
