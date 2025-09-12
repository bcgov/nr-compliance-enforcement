import { Module } from "@nestjs/common";
import { EquipmentStatusCodeResolver } from "./equipment_status_code.resolver";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";
import { EquipmentStatusCodeService } from "./equipment_status_code.service";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [EquipmentStatusCodeResolver, EquipmentStatusCodeService],
})
export class EquipmentStatusCodeModule {}
