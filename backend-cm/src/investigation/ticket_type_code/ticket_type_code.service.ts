import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { ticket_type_code } from "../../../prisma/investigation/generated/ticket_type_code";
import { TicketTypeCode } from "../../investigation/ticket_type_code/dto/ticket_type_code";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";

@Injectable()
export class TicketTypeCodeService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(TicketTypeCodeService.name);

  async findTicketTypeCodes(): Promise<TicketTypeCode[]> {
    const prismaCodes = await this.prisma.ticket_type_code.findMany({
      select: {
        ticket_type_code: true,
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

    return this.mapper.mapArray<ticket_type_code, TicketTypeCode>(
      prismaCodes as Array<ticket_type_code>,
      "ticket_type_code",
      "TicketTypeCode",
    );
  }
}
