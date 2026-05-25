import { Module } from "@nestjs/common";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { AutomapperModule } from "@automapper/nestjs";
import { UserModule } from "../../common/user.module";
import { EnforcementActionResolver } from "../../investigation/enforcement_action/enforcement_action.resolver";
import { EnforcementActionService } from "../../investigation/enforcement_action/enforcement_action.service";
import { InvestigationService } from "../investigation/investigation.service";
import { SharedPrismaService } from "src/prisma/shared/prisma.shared.service";
import { PaginationUtility } from "src/common/pagination.utility";
import { CaseFileService } from "src/shared/case_file/case_file.service";
import { EventPublisherService } from "src/event_publisher/event_publisher.service";
import { CaseActivityService } from "src/shared/case_activity/case_activity.service";

@Module({
  imports: [PrismaModuleInvestigation, AutomapperModule, UserModule],
  providers: [
    EnforcementActionResolver,
    EnforcementActionService,
    InvestigationService,
    SharedPrismaService,
    PaginationUtility,
    CaseFileService,
    EventPublisherService,
    CaseActivityService,
  ],
  exports: [EnforcementActionService],
})
export class EnforcementActionModule {}
