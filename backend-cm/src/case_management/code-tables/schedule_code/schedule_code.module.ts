import { Module } from "@nestjs/common";
import { PrismaModuleComplaintOutcome } from "../../../prisma/complaint_outcome/prisma.complaint_outcome.module";
import { ScheduleCodeResolver } from "./schedule_code.resolver";
import { ScheduleCodeService } from "./schedule_code.service";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [ScheduleCodeResolver, ScheduleCodeService],
})
export class ScheduleCodeModule {}
