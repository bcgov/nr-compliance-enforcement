import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { team } from "prisma/shared/generated/team";
import { Team } from "./dto/team";

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(TeamService.name);

  async findAll() {
    const prismaTeams = await this.prisma.team.findMany({
      select: {
        team_guid: true,
        team_code: true,
        agency_code_ref: true,
        active_ind: true,
        create_user_id: true,
        create_utc_timestamp: true,
        update_user_id: true,
        update_utc_timestamp: true,
      },
    });

    return this.mapper.mapArray<team, Team>(prismaTeams as Array<team>, "team", "Team");
  }
}
