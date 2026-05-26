import { Module } from "@nestjs/common";
import { ExhibitService } from "./exhibit.service";
import { ExhibitResolver } from "./exhibit.resolver";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { UserModule } from "../../common/user.module";
import { PaginationModule } from "../../common/pagination.module";
import { InvestigationService } from "../investigation/investigation.service";
import { CaseActivityService } from "src/shared/case_activity/case_activity.service";
import { EventPublisherService } from "src/event_publisher/event_publisher.service";
import { CaseFileService } from "src/shared/case_file/case_file.service";
import { PaginationUtility } from "src/common/pagination.utility";
import { SharedPrismaService } from "src/prisma/shared/prisma.shared.service";

@Module({
  imports: [PrismaModuleInvestigation, UserModule, PaginationModule],
  providers: [
    ExhibitResolver,
    ExhibitService,
    InvestigationService,
    SharedPrismaService,
    PaginationUtility,
    CaseFileService,
    EventPublisherService,
    CaseActivityService,
  ],
})
export class ExhibitModule {}
