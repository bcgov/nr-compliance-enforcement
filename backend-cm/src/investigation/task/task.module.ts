import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskResolver } from "./task.resolver";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";

@Module({
  imports: [PrismaModuleInvestigation],
  providers: [TaskResolver, TaskService],
})
export class TaskModule {}
