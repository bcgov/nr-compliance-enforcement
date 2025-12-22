import { Module } from "@nestjs/common";
import { TaskStatusCodeService } from "./task_status_code.service";
import { TaskStatusCodeResolver } from "./task_status_code.resolver";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";

@Module({
  imports: [PrismaModuleInvestigation],
  providers: [TaskStatusCodeResolver, TaskStatusCodeService],
})
export class TaskStatusCodeModule {}
