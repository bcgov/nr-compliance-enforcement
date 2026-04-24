import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { ticket_outcome_code } from "../../../prisma/investigation/generated/ticket_outcome_code";
import { TicketOutcomeCode } from "../../investigation/ticket_outcome_code/dto/ticket_outcome_code";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";

@Injectable()
export class TicketOutcomeCodeService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(TicketOutcomeCodeService.name);

  async findTicketOutcomeCodes(): Promise<TicketOutcomeCode[]> {
    const prismaCodes = await this.prisma.ticket_outcome_code.findMany({
      select: {
        ticket_outcome_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
      where: {
        active_ind: true,
      },
      orderBy: {
        display_order: "asc",
      },
    });

    return this.mapper.mapArray<ticket_outcome_code, TicketOutcomeCode>(
      prismaCodes as Array<ticket_outcome_code>,
      "ticket_outcome_code",
      "TicketOutcomeCode",
    );
  }
}
