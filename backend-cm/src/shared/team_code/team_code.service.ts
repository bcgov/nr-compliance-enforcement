import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { team_code } from "prisma/shared/generated/team_code";
import { TeamCode } from "./dto/team_code";

@Injectable()
export class TeamCodeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(TeamCodeService.name);

  async findAll() {
    const prismaTeamCodes = await this.prisma.team_code.findMany({
      select: {
        team_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
      orderBy: {
        display_order: "asc",
      },
    });

    return this.mapper.mapArray<team_code, TeamCode>(prismaTeamCodes as Array<team_code>, "team_code", "TeamCode");
  }
}
