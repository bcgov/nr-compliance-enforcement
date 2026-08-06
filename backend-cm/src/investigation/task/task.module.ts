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
import { CosGeoOrgUnitModule } from "src/shared/cos_geo_org_unit/cos_geo_org_unit.module";

@Module({
  imports: [PrismaModuleInvestigation, UserModule, CosGeoOrgUnitModule],
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
