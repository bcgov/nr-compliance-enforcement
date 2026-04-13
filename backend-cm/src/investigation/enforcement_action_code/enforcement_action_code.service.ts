import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
import { EnforcementActionCode } from "src/investigation/enforcement_action_code/dto/enforcement_action_code";
import { enforcement_action_code } from "prisma/investigation/generated/enforcement_action_code";

@Injectable()
export class EnforcementActionCodeService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(EnforcementActionCodeService.name);

  async findEnforcementActionCodes(agencyCode: string): Promise<EnforcementActionCode[]> {
    const prismaCodes = await this.prisma.enforcement_action_code.findMany({
      select: {
        enforcement_action_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
      where: {
        active_ind: true,
        enforcement_action_code_agency_xref_enforcement_action_code_agency_xref_enforcement_action_codeToenforcement_action_code:
          {
            some: {
              agency_code_ref: agencyCode,
              active_ind: true,
            },
          },
      },
      orderBy: {
        display_order: "asc",
      },
    });

    return this.mapper.mapArray<enforcement_action_code, EnforcementActionCode>(
      prismaCodes as Array<enforcement_action_code>,
      "enforcement_action_code",
      "EnforcementActionCode",
    );
  }
}
