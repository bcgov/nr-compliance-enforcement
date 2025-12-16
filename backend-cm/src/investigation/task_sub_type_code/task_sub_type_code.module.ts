import { Module } from "@nestjs/common";
import { TaskSubTypeCodeService } from "./task_sub_type_code.service";
import { TaskSubTypeCodeResolver } from "./task_sub_type_code.resolver";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";

@Module({
  imports: [PrismaModuleInvestigation],
  providers: [TaskSubTypeCodeResolver, TaskSubTypeCodeService],
})
export class TaskSubTypeCodeModule {}
