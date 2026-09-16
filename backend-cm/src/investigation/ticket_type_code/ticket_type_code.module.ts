import { Module } from "@nestjs/common";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { AutomapperModule } from "@automapper/nestjs";
import { TicketTypeCodeResolver } from "../../investigation/ticket_type_code/ticket_type_code.resolver";
import { TicketTypeCodeService } from "../../investigation/ticket_type_code/ticket_type_code.service";

@Module({
  imports: [PrismaModuleInvestigation, AutomapperModule],
  providers: [TicketTypeCodeResolver, TicketTypeCodeService],
  exports: [TicketTypeCodeService],
})
export class TicketTypeCodeModule {}
