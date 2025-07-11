import { Module } from "@nestjs/common";
import { EquipmentStatusCodeResolver } from "./equipment_status_code.resolver";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";
import { EquipmentStatusCodeService } from "./equipment_status_code.service";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [EquipmentStatusCodeResolver, EquipmentStatusCodeService],
})
export class EquipmentStatusCodeModule {}
