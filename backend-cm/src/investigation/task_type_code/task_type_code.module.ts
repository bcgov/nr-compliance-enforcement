import { Module } from "@nestjs/common";
import { TaskTypeCodeService } from "./task_type_code.service";
import { TaskTypeCodeResolver } from "./task_type_code.resolver";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";

@Module({
  imports: [PrismaModuleInvestigation],
  providers: [TaskTypeCodeResolver, TaskTypeCodeService],
})
export class TaskTypeCodeModule {}
