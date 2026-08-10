import { Module } from "@nestjs/common";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { LegislationConfigurationResolver } from "./legislation_configuration.resolver";
import { LegislationConfigurationService } from "./legislation_configuration.service";

@Module({
  imports: [PrismaModuleShared, PrismaModuleInvestigation],
  providers: [LegislationConfigurationResolver, LegislationConfigurationService],
  exports: [LegislationConfigurationService],
})
export class LegislationConfigurationModule {}
