import { Inject, Injectable, Logger } from "@nestjs/common";
import { Team } from "./entities/team.entity";
import { DataSource, QueryRunner, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { REQUEST } from "@nestjs/core";
import { UUID } from "crypto";
import { TeamCode } from "../team_code/entities/team_code.entity";
import { TeamType } from "src/types/models/code-tables/team-type";
import { CssService } from "src/external_api/css/css.service";
import { Officer } from "../officer/entities/officer.entity";
import { OfficerTeamXref } from "../officer_team_xref/entities/officer_team_xref.entity";
import { OfficerTeamXrefService } from "../officer_team_xref/officer_team_xref.service";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);

  @InjectRepository(Team)
  private teamRepository: Repository<Team>;
  @InjectRepository(OfficerTeamXref)
  private officerTeamXrefRepository: Repository<OfficerTeamXref>;
  @Inject(CssService)
  private readonly cssService: CssService;
  @Inject(OfficerTeamXrefService)
  private readonly officerTeamXrefService: OfficerTeamXrefService;

  async findAll(): Promise<Team[]> {
    return this.teamRepository.find({
      relations: {
        team_code: true,
        agency_code: true,
      },
      order: {
        agency_code: "ASC",
        team_code: "ASC",
      },
    });
  }

  async findOne(id: any): Promise<Team> {
    return this.teamRepository.findOneOrFail({
      where: { team_guid: id },
      relations: {
        team_code: true,
        agency_code: true,
      },
    });
  }

  async findByTeamCodeAndAgencyCode(teamCode: any, agencyCode) {
    return this.teamRepository.findOneOrFail({
      where: { team_code: teamCode, agency_code: agencyCode },
    });
  }

  async findUserIdir(firstName, lastName) {
    const userIdir = this.cssService.getUserIdirByName(firstName, lastName);
    return userIdir;
  }

  async update(officerGuid, updateTeamData) {
    let result;
    //Update Team
    const { teamCode, agencyCode, role, userIdir } = updateTeamData;
    const teamGuid = await this.findByTeamCodeAndAgencyCode(teamCode, agencyCode);
    // const updateData = {
    //   officer_guid: officerGuid,
    //   team_guid: teamGuid.team_guid as QueryDeepPartialEntity<Team>,
    //   active_ind: true,
    //   create_user_id: "postgres",
    // };
    // const upsertData = await this.officerTeamXrefRepository.upsert(updateData, ["officer_guid", "team_guid"]);
    // console.log(upsertData);

    const officerTeamXref = await this.officerTeamXrefService.findByOfficerAndTeam(officerGuid, teamGuid.team_guid);
    if (!officerTeamXref) {
      const newEntity = {
        officer_guid: officerGuid,
        team_guid: teamGuid,
        active_ind: true,
        create_user_id: "postgres",
        update_user_id: "postgres",
      };
      const newRecord = await this.officerTeamXrefRepository.create(newEntity);
      await this.officerTeamXrefRepository.save(newRecord);
    }

    //Update Role
    const updateRole = await this.cssService.updateUserRole(userIdir, role);
    console.log(updateRole);
  }

  remove(id: number) {
    return `This action removes a #${id} Team`;
  }
}
