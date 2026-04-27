import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
import { EnforcementActionCode } from "src/investigation/enforcement_action_code/dto/enforcement_action_code";

@Injectable()
export class EnforcementActionCodeService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(EnforcementActionCodeService.name);

  async findEnforcementActionCodes(): Promise<EnforcementActionCode[]> {
    const prismaXrefs = await this.prisma.enforcement_action_code_agency_xref.findMany({
      where: {
        active_ind: true,
      },
      include: {
        enforcement_action_code_enforcement_action_code_agency_xref_enforcement_action_codeToenforcement_action_code:
          true,
      },
      orderBy: {
        enforcement_action_code_enforcement_action_code_agency_xref_enforcement_action_codeToenforcement_action_code: {
          display_order: "asc",
        },
      },
    });

    return this.mapper.mapArray(prismaXrefs, "enforcement_action_code_agency_xref", "EnforcementActionCode");
  }
}
