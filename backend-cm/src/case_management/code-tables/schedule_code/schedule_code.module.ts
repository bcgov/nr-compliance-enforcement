import { Module } from "@nestjs/common";
import { PrismaModuleCaseManagement } from "../../../prisma/cm/prisma.cm.module";
import { ScheduleCodeResolver } from "./schedule_code.resolver";
import { ScheduleCodeService } from "./schedule_code.service";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [ScheduleCodeResolver, ScheduleCodeService],
})
export class ScheduleCodeModule {}
