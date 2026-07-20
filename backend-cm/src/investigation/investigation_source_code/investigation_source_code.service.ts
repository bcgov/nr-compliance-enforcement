import { Injectable } from "@nestjs/common";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { InvestigationSourceCode } from "./dto/investigation_source_code";
import { investigation_source_code } from "../../../prisma/investigation/generated/investigation_source_code";

@Injectable()
export class InvestigationSourceCodeService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findAll() {
    const prismaInvestigationSources = await this.prisma.investigation_source_code.findMany({
      select: {
        investigation_source_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
      where: {
        active_ind: true,
      },
      orderBy: {
        short_description: "asc",
      },
    });

    return this.mapper.mapArray<investigation_source_code, InvestigationSourceCode>(
      prismaInvestigationSources as Array<investigation_source_code>,
      "investigation_source_code",
      "InvestigationSourceCode",
    );
  }
}
