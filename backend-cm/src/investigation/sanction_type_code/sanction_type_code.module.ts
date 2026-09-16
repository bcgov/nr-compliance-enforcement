import { Module } from "@nestjs/common";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { AutomapperModule } from "@automapper/nestjs";
import { SanctionTypeCodeResolver } from "../../investigation/sanction_type_code/sanction_type_code.resolver";
import { SanctionTypeCodeService } from "../../investigation/sanction_type_code/sanction_type_code.service";

@Module({
  imports: [PrismaModuleInvestigation, AutomapperModule],
  providers: [SanctionTypeCodeResolver, SanctionTypeCodeService],
  exports: [SanctionTypeCodeService],
})
export class SanctionTypeCodeModule {}
