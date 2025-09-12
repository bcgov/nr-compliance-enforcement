import { Module } from "@nestjs/common";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";
import { ScheduleSectorXrefService } from "./schedule_sector_xref.service";
import { ScheduleSectorXrefResolver } from "./schedule_sector_xref.resolver";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [ScheduleSectorXrefResolver, ScheduleSectorXrefService],
})
export class ScheduleSectorXrefModule {}
