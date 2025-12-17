import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskResolver } from "./task.resolver";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { UserModule } from "../../common/user.module";

@Module({
  imports: [PrismaModuleInvestigation, UserModule],
  providers: [TaskResolver, TaskService],
})
export class TaskModule {}
