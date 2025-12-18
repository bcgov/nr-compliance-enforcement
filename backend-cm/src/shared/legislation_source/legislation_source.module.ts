import { Module } from "@nestjs/common";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { LegislationSourceResolver } from "./legislation_source.resolver";
import { LegislationSourceService } from "./legislation_source.service";

@Module({
  imports: [PrismaModuleShared],
  providers: [LegislationSourceResolver, LegislationSourceService],
  exports: [LegislationSourceService],
})
export class LegislationSourceModule {}
