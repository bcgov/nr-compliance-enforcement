import { Module } from "@nestjs/common";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { AutomapperModule } from "@automapper/nestjs";
import { EnforcementActionCodeResolver } from "src/investigation/enforcement_action_code/enforcement_action_code.resolver";
import { EnforcementActionCodeService } from "src/investigation/enforcement_action_code/enforcement_action_code.service";

@Module({
  imports: [PrismaModuleInvestigation, AutomapperModule],
  providers: [EnforcementActionCodeResolver, EnforcementActionCodeService],
  exports: [EnforcementActionCodeService],
})
export class EnforcementActionCodeModule {}
