import { Module } from "@nestjs/common";
import { EquipmentCodeResolver } from "./equipment_code.resolver";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";
import { EquipmentCodeService } from "./equipment_code.service";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [EquipmentCodeResolver, EquipmentCodeService],
})
export class EquipmentCodeModule {}
