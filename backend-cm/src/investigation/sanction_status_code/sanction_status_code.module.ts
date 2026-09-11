import { Module } from "@nestjs/common";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { AutomapperModule } from "@automapper/nestjs";
import { SanctionStatusCodeResolver } from "../../investigation/sanction_status_code/sanction_status_code.resolver";
import { SanctionStatusCodeService } from "../../investigation/sanction_status_code/sanction_status_code.service";

@Module({
  imports: [PrismaModuleInvestigation, AutomapperModule],
  providers: [SanctionStatusCodeResolver, SanctionStatusCodeService],
  exports: [SanctionStatusCodeService],
})
export class SanctionStatusCodeModule {}
