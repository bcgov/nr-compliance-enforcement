import { Module } from "@nestjs/common";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { WildlifeManagementUnitCodeResolver } from "src/shared/wildlife_management_unit_code/wildlife_management_unit_code.resolver";
import { WildlifeManagementUnitCodeService } from "src/shared/wildlife_management_unit_code/wildlife_management_unit_code.service";

@Module({
  imports: [PrismaModuleShared],
  providers: [WildlifeManagementUnitCodeResolver, WildlifeManagementUnitCodeService],
})
export class WildlifeManagementUnitCodeModule {}
