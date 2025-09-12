import { Module } from "@nestjs/common";
import { EquipmentCodeResolver } from "./equipment_code.resolver";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";
import { EquipmentCodeService } from "./equipment_code.service";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [EquipmentCodeResolver, EquipmentCodeService],
})
export class EquipmentCodeModule {}
