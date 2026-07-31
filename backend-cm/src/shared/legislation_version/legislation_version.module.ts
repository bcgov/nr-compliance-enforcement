import { Module } from "@nestjs/common";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { LegislationModule } from "../legislation/legislation.module";
import { LegislationVersionService } from "./legislation_version.service";

@Module({
  imports: [PrismaModuleShared, PrismaModuleInvestigation, LegislationModule],
  providers: [LegislationVersionService],
  exports: [LegislationVersionService],
})
export class LegislationVersionModule {}
