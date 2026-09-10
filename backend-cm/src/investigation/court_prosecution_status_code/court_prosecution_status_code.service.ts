import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { court_prosecution_status_code } from "../../../prisma/investigation/generated/court_prosecution_status_code";
import { CourtProsecutionStatusCode } from "../../investigation/court_prosecution_status_code/dto/court_prosecution_status_code";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";

@Injectable()
export class CourtProsecutionStatusCodeService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(CourtProsecutionStatusCodeService.name);

  async findCourtProsecutionStatusCodes(): Promise<CourtProsecutionStatusCode[]> {
    const prismaCodes = await this.prisma.court_prosecution_status_code.findMany({
      select: {
        court_prosecution_status_code: true,
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

    return this.mapper.mapArray<court_prosecution_status_code, CourtProsecutionStatusCode>(
      prismaCodes as Array<court_prosecution_status_code>,
      "court_prosecution_status_code",
      "CourtProsecutionStatusCode",
    );
  }
}
