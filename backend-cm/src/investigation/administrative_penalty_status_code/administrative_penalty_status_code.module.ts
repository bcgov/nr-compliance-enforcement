import { Module } from "@nestjs/common";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { AutomapperModule } from "@automapper/nestjs";
import { AdministrativePenaltyStatusCodeResolver } from "../../investigation/administrative_penalty_status_code/administrative_penalty_status_code.resolver";
import { AdministrativePenaltyStatusCodeService } from "../../investigation/administrative_penalty_status_code/administrative_penalty_status_code.service";

@Module({
  imports: [PrismaModuleInvestigation, AutomapperModule],
  providers: [AdministrativePenaltyStatusCodeResolver, AdministrativePenaltyStatusCodeService],
  exports: [AdministrativePenaltyStatusCodeService],
})
export class AdministrativePenaltyStatusCodeModule {}
