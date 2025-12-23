import { Module } from "@nestjs/common";
import { TaskCategoryTypeCodeService } from "./task_category_type_code.service";
import { TaskCategoryTypeCodeResolver } from "./task_category_type_code.resolver";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";

@Module({
  imports: [PrismaModuleInvestigation],
  providers: [TaskCategoryTypeCodeResolver, TaskCategoryTypeCodeService],
})
export class TaskCategoryTypeCodeModule {}
