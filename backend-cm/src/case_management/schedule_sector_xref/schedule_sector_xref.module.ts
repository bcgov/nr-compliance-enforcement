import { Module } from "@nestjs/common";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";
import { ScheduleSectorXrefService } from "./schedule_sector_xref.service";
import { ScheduleSectorXrefResolver } from "./schedule_sector_xref.resolver";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [ScheduleSectorXrefResolver, ScheduleSectorXrefService],
})
export class ScheduleSectorXrefModule {}
