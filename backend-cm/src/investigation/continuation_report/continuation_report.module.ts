import { Module } from "@nestjs/common";
import { ContinuationReportService } from "./continuation_report.service";
import { ContinuationReportResolver } from "./continuation_report.resolver";
import { PrismaModuleInvestigation } from "src/prisma/investigation/prisma.investigation.module";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { AutomapperModule } from "@automapper/nestjs";
import { UserModule } from "src/common/user.module";
import { InvestigationModule } from "src/investigation/investigation/investigation.module";

@Module({
  imports: [PrismaModuleInvestigation, PrismaModuleShared, InvestigationModule, AutomapperModule, UserModule],
  providers: [ContinuationReportResolver, ContinuationReportService],
  exports: [ContinuationReportService],
})
export class ContinuationReportModule {}
