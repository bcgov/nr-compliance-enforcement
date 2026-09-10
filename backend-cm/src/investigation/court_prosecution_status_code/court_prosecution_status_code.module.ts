import { Module } from "@nestjs/common";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { AutomapperModule } from "@automapper/nestjs";
import { CourtProsecutionStatusCodeResolver } from "../../investigation/court_prosecution_status_code/court_prosecution_status_code.resolver";
import { CourtProsecutionStatusCodeService } from "../../investigation/court_prosecution_status_code/court_prosecution_status_code.service";

@Module({
  imports: [PrismaModuleInvestigation, AutomapperModule],
  providers: [CourtProsecutionStatusCodeResolver, CourtProsecutionStatusCodeService],
  exports: [CourtProsecutionStatusCodeService],
})
export class CourtProsecutionStatusCodeModule {}
