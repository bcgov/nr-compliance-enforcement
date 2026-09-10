import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { administrative_penalty_status_code } from "../../../prisma/investigation/generated/administrative_penalty_status_code";
import { AdministrativePenaltyStatusCode } from "../../investigation/administrative_penalty_status_code/dto/administrative_penalty_status_code";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";

@Injectable()
export class AdministrativePenaltyStatusCodeService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(AdministrativePenaltyStatusCodeService.name);

  async findAdministrativePenaltyStatusCodes(): Promise<AdministrativePenaltyStatusCode[]> {
    const prismaCodes = await this.prisma.administrative_penalty_status_code.findMany({
      select: {
        administrative_penalty_status_code: true,
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

    return this.mapper.mapArray<administrative_penalty_status_code, AdministrativePenaltyStatusCode>(
      prismaCodes as Array<administrative_penalty_status_code>,
      "administrative_penalty_status_code",
      "AdministrativePenaltyStatusCode",
    );
  }
}
