import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { sanction_type_code } from "../../../prisma/investigation/generated/sanction_type_code";
import { SanctionTypeCode } from "../../investigation/sanction_type_code/dto/sanction_type_code";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";

@Injectable()
export class SanctionTypeCodeService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(SanctionTypeCodeService.name);

  async findSanctionTypeCodes(): Promise<SanctionTypeCode[]> {
    const prismaCodes = await this.prisma.sanction_type_code.findMany({
      select: {
        sanction_type_code: true,
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

    return this.mapper.mapArray<sanction_type_code, SanctionTypeCode>(
      prismaCodes as Array<sanction_type_code>,
      "sanction_type_code",
      "SanctionTypeCode",
    );
  }
}
