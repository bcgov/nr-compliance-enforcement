import { Module } from "@nestjs/common";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { AutomapperModule } from "@automapper/nestjs";
import { TicketOutcomeCodeResolver } from "../../investigation/ticket_outcome_code/ticket_outcome_code.resolver";
import { TicketOutcomeCodeService } from "../../investigation/ticket_outcome_code/ticket_outcome_code.service";

@Module({
  imports: [PrismaModuleInvestigation, AutomapperModule],
  providers: [TicketOutcomeCodeResolver, TicketOutcomeCodeService],
  exports: [TicketOutcomeCodeService],
})
export class TicketOutcomeCodeModule {}
