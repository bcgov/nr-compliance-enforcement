import { Module } from "@nestjs/common";
import { InvestigationSourceCodeService } from "./investigation_source_code.service";
import { InvestigationSourceCodeResolver } from "./investigation_source_code.resolver";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";

@Module({
  imports: [PrismaModuleInvestigation],
  providers: [InvestigationSourceCodeResolver, InvestigationSourceCodeService],
})
export class InvestigationSourceCodeModule {}
