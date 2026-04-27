import { Module } from "@nestjs/common";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { AutomapperModule } from "@automapper/nestjs";
import { UserModule } from "../../common/user.module";
import { EnforcementActionResolver } from "../../investigation/enforcement_action/enforcement_action.resolver";
import { EnforcementActionService } from "../../investigation/enforcement_action/enforcement_action.service";

@Module({
  imports: [PrismaModuleInvestigation, AutomapperModule, UserModule],
  providers: [EnforcementActionResolver, EnforcementActionService],
  exports: [EnforcementActionService],
})
export class EnforcementActionModule {}
