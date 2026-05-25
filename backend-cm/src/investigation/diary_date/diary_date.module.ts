import { Module } from "@nestjs/common";
import { DiaryDateService } from "./diary_date.service";
import { DiaryDateResolver } from "./diary_date.resolver";
import { PrismaModuleInvestigation } from "src/prisma/investigation/prisma.investigation.module";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { AutomapperModule } from "@automapper/nestjs";
import { UserModule } from "src/common/user.module";
import { InvestigationService } from "../investigation/investigation.service";
import { CaseActivityService } from "src/shared/case_activity/case_activity.service";
import { EventPublisherService } from "src/event_publisher/event_publisher.service";
import { CaseFileService } from "src/shared/case_file/case_file.service";
import { PaginationUtility } from "src/common/pagination.utility";
import { SharedPrismaService } from "src/prisma/shared/prisma.shared.service";

@Module({
  imports: [PrismaModuleInvestigation, PrismaModuleShared, AutomapperModule, UserModule],
  providers: [
    DiaryDateResolver,
    DiaryDateService,
    InvestigationService,
    SharedPrismaService,
    PaginationUtility,
    CaseFileService,
    EventPublisherService,
    CaseActivityService,
  ],
  exports: [DiaryDateService],
})
export class DiaryDateModule {}
