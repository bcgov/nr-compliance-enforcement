import { Module } from "@nestjs/common";
import { PartyResolver } from "./party.resolver";
import { PartyService } from "./party.service";
import { PartyHistoryResolver } from "./party-history.resolver";
import { PartyHistoryService } from "./party-history.service";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { AutomapperModule } from "@automapper/nestjs";
import { PaginationModule } from "../../common/pagination.module";
import { UserModule } from "../../common/user.module";
import { InvestigationModule } from "../../investigation/investigation/investigation.module";
import { InspectionModule } from "../../inspection/inspection/inspection.module";
import { CaseFileModule } from "../case_file/case_file.module";
import { AppUserModule } from "src/shared/app_user/app_user.module";

@Module({
  imports: [
    PrismaModuleShared,
    AutomapperModule,
    PaginationModule,
    UserModule,
    AppUserModule,
    InvestigationModule,
    InspectionModule,
    CaseFileModule,
  ],
  providers: [PartyResolver, PartyService, PartyHistoryResolver, PartyHistoryService],
})
export class PartyModule {}
