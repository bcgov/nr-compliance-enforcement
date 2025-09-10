import { Module } from "@nestjs/common";
import { InvestigationService } from "./investigation.service";
import { InvestigationResolver } from "./investigation.resolver";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { AutomapperModule } from "@automapper/nestjs";
import { PaginationModule } from "src/common/pagination.module";
import { CaseFileModule } from "src/shared/case_file/case_file.module";
import { CaseFileService } from "src/shared/case_file/case_file.service";
import { UserModule } from "src/common/user.module";

@Module({
  imports: [
    PrismaModuleInvestigation,
    PrismaModuleShared,
    AutomapperModule,
    PaginationModule,
    CaseFileModule,
    UserModule,
  ],
  providers: [InvestigationResolver, InvestigationService, CaseFileService],
})
export class InvestigationModule {}
