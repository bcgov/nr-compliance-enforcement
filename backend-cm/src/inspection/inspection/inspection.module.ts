import { Module } from "@nestjs/common";
import { InspectionService } from "./inspection.service";
import { InspectionResolver } from "./inspection.resolver";
import { PrismaModuleInspection } from "../../prisma/inspection/prisma.inspection.module";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { AutomapperModule } from "@automapper/nestjs";
import { PaginationModule } from "src/common/pagination.module";
import { CaseFileModule } from "src/shared/case_file/case_file.module";
import { CaseFileService } from "src/shared/case_file/case_file.service";
import { UserModule } from "src/common/user.module";
import { EventPublisherModule } from "src/event_publisher/event_publisher.module";
import { CaseActivityModule } from "src/shared/case_activity/case_activity.module";

@Module({
  imports: [
    PrismaModuleInspection,
    PrismaModuleShared,
    AutomapperModule,
    PaginationModule,
    CaseFileModule,
    UserModule,
    EventPublisherModule,
    CaseActivityModule,
  ],
  providers: [InspectionResolver, InspectionService, CaseFileService],
  exports: [InspectionService],
})
export class InspectionModule {}
