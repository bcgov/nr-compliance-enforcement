import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskResolver } from "./task.resolver";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { UserModule } from "../../common/user.module";
import { InvestigationService } from "../investigation/investigation.service";
import { SharedPrismaService } from "src/prisma/shared/prisma.shared.service";
import { PaginationUtility } from "src/common/pagination.utility";
import { CaseFileService } from "src/shared/case_file/case_file.service";
import { EventPublisherService } from "src/event_publisher/event_publisher.service";
import { CaseActivityService } from "src/shared/case_activity/case_activity.service";

@Module({
  imports: [PrismaModuleInvestigation, UserModule],
  providers: [
    TaskResolver,
    TaskService,
    InvestigationService,
    SharedPrismaService,
    PaginationUtility,
    CaseFileService,
    EventPublisherService,
    CaseActivityService,
  ],
})
export class TaskModule {}
