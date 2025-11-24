import { Module } from "@nestjs/common";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { LegislationResolver } from "./legislation.resolver";
import { LegislationService } from "./legislation.service";

@Module({
  imports: [PrismaModuleShared],
  providers: [LegislationResolver, LegislationService],
  exports: [LegislationService],
})
export class LegislationModule {}
