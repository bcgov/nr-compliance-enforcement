import { Module } from "@nestjs/common";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { LegislationModule } from "../legislation/legislation.module";
import { LegislationVersionModule } from "../legislation_version/legislation_version.module";
import { LegislationSourceResolver } from "./legislation_source.resolver";
import { LegislationSourceService } from "./legislation_source.service";

@Module({
  imports: [PrismaModuleShared, LegislationModule, LegislationVersionModule],
  providers: [LegislationSourceResolver, LegislationSourceService],
  exports: [LegislationSourceService],
})
export class LegislationSourceModule {}
