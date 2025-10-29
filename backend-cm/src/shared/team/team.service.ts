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

  async findAll(teamCode?: string, agencyCode?: string) {
    const whereClause: any = {};

    if (teamCode) {
      whereClause.team_code = teamCode;
    }

    if (agencyCode) {
      whereClause.agency_code_ref = agencyCode;
    }

    const teams = await this.prisma.team.findMany({
      where: whereClause,
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
      orderBy: [{ agency_code_ref: "asc" }, { team_code: "asc" }],
    });

    return this.mapper.mapArray<team, Team>(teams as Array<team>, "team", "Team");
  }

  async findOne(teamGuid: string) {
    const team = await this.prisma.team.findUnique({
      where: { team_guid: teamGuid },
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

    if (!team) {
      return null;
    }

    return this.mapper.map<team, Team>(team as team, "team", "Team");
  }
}
