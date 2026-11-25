import { Module } from "@nestjs/common";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { UserModule } from "../../common/user.module";
import { InvestigationModule } from "../investigation/investigation.module";
import { ContraventionResolver } from "src/investigation/contravention/contravention.resolver";
import { ContraventionService } from "src/investigation/contravention/contravention.service";
import { EnforcementActionModule } from "src/investigation/enforcement_action/enforcement_action.module";

@Module({
  imports: [PrismaModuleInvestigation, PrismaModuleShared, UserModule, InvestigationModule, EnforcementActionModule],
  providers: [ContraventionResolver, ContraventionService],
})
export class ContraventionModule {}
