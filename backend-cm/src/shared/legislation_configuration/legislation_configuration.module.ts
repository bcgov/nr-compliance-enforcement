import { Module } from "@nestjs/common";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { LegislationConfigurationResolver } from "./legislation_configuration.resolver";
import { LegislationConfigurationService } from "./legislation_configuration.service";

@Module({
  imports: [PrismaModuleShared],
  providers: [LegislationConfigurationResolver, LegislationConfigurationService],
  exports: [LegislationConfigurationService],
})
export class LegislationConfigurationModule {}
