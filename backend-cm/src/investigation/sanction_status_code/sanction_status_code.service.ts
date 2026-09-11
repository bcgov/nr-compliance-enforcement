import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { sanction_status_code } from "../../../prisma/investigation/generated/sanction_status_code";
import { SanctionStatusCode } from "../../investigation/sanction_status_code/dto/sanction_status_code";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";

@Injectable()
export class SanctionStatusCodeService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(SanctionStatusCodeService.name);

  async findSanctionStatusCodes(): Promise<SanctionStatusCode[]> {
    const prismaCodes = await this.prisma.sanction_status_code.findMany({
      select: {
        sanction_status_code: true,
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

    return this.mapper.mapArray<sanction_status_code, SanctionStatusCode>(
      prismaCodes as Array<sanction_status_code>,
      "sanction_status_code",
      "SanctionStatusCode",
    );
  }
}
