import { Module } from "@nestjs/common";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { LegislationModule } from "../legislation/legislation.module";
import { LegislationVersionResolver } from "./legislation_version.resolver";
import { LegislationVersionService } from "./legislation_version.service";

@Module({
  imports: [PrismaModuleShared, PrismaModuleInvestigation, LegislationModule],
  providers: [LegislationVersionResolver, LegislationVersionService],
  exports: [LegislationVersionService],
})
export class LegislationVersionModule {}
