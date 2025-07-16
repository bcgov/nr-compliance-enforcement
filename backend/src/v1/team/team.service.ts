import { Inject, Injectable, Logger } from "@nestjs/common";
import { Team } from "./entities/team.entity";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CssService } from "../../external_api/css/css.service";
import { OfficerTeamXref } from "../officer_team_xref/entities/officer_team_xref.entity";
import { Role } from "../../enum/role.enum";
import { TeamUpdate } from "../../types/models/general/team-update";
import { Officer } from "../officer/entities/officer.entity";

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);

  constructor(private readonly dataSource: DataSource) {}

  @InjectRepository(Team)
  private readonly teamRepository: Repository<Team>;
  @InjectRepository(OfficerTeamXref)
  private readonly officerTeamXrefRepository: Repository<OfficerTeamXref>;
  @InjectRepository(Officer)
  private readonly officerRepository: Repository<Officer>;

  @Inject(CssService)
  private readonly cssService: CssService;

  async findAll(): Promise<Team[]> {
    return this.teamRepository.find({
      relations: {
        team_code: true,
      },
      order: {
        agency_code_ref: "ASC",
        team_code: "ASC",
      },
    });
  }

  async findOne(id: any): Promise<Team> {
    return this.teamRepository.findOneOrFail({
      where: { team_guid: id },
      relations: {
        team_code: true,
      },
    });
  }

  async findByTeamCodeAndAgencyCode(teamCode: any, agencyCode) {
    return this.teamRepository.findOneOrFail({
      where: { team_code: teamCode, agency_code_ref: agencyCode },
      relations: {
        team_code: true,
      },
    });
  }

  async findUserIdir(firstName, lastName) {
    const userIdir = await this.cssService.getUserIdirByName(firstName, lastName);
    return userIdir;
  }

  async findUserCurrentRoles(userIdir): Promise<{ name: string; composite: string }[]> {
    const currentRoles = await this.cssService.getUserRoles(userIdir);
    return currentRoles;
  }

  async findUserCurrentTeam(officerGuid) {
    return await this.officerTeamXrefRepository.findOne({
      where: { officer_guid: officerGuid },
      relations: { team_guid: { team_code: true } },
    });
  }

  async update(officerGuid, updateTeamData: TeamUpdate) {
    let result = {
      team: false,
      roles: false,
    };
    const { teamCode, agencyCode, userIdir, roles: updateRoles, adminIdirUsername } = updateTeamData;
    try {
      // Update the officers agency
      await this.officerRepository.update({ officer_guid: officerGuid }, { agency_code: { agency_code: agencyCode } });
      //Update team
      //Assume one officer belong to one team for now
      //If user's team is null -> remove any current team user is in
      const officerTeamXref = await this.officerTeamXrefRepository.findOne({ where: { officer_guid: officerGuid } });
      if (!teamCode) {
        if (officerTeamXref) {
          const deleteResult = await this.officerTeamXrefRepository.delete(officerTeamXref.officer_team_xref_guid);
          if (deleteResult.affected > 0) {
            result.team = true;
          } else result.team = false;
        }
      } else {
        const teamGuid = await this.findByTeamCodeAndAgencyCode(teamCode, agencyCode);
        //set user's office_guid to null because CEEB user doesn't have an office
        await this.officerRepository.update({ officer_guid: officerGuid }, { office_guid: null });

        if (officerTeamXref) {
          const updateEnity = {
            team_guid: teamGuid,
            active_ind: true,
            update_user_id: adminIdirUsername,
          };
          const updateResult = await this.officerTeamXrefRepository.update({ officer_guid: officerGuid }, updateEnity);
          if (updateResult.affected > 0) {
            result.team = true;
          } else result.team = false;
        } else {
          //Create new one
          const newEntity = {
            officer_guid: officerGuid,
            team_guid: teamGuid,
            active_ind: true,
            create_user_id: adminIdirUsername,
            update_user_id: adminIdirUsername,
          };
          const newRecord = this.officerTeamXrefRepository.create(newEntity);
          const saveResult = await this.officerTeamXrefRepository.save(newRecord);
          if (saveResult.officer_guid) {
            result.team = true;
          } else result.team = false;
        }
      }

      //Update Role
      const currentRoles: any = await this.cssService.getUserRoles(userIdir);
      for await (const roleItem of currentRoles) {
        const rolesMatchWithUpdate = updateRoles.some((updateRole) => updateRole.name === roleItem.name);
        //Remove existing roles that do not match with updated roles, but still keeps Admin role
        if (roleItem.name !== Role.TEMPORARY_TEST_ADMIN && !rolesMatchWithUpdate) {
          await this.cssService.deleteUserRole(userIdir, roleItem.name);
        }
      }
      const updated = await this.cssService.updateUserRole(userIdir, updateRoles);
      if (updated.length > 0) {
        result.roles = true;
      } else result.roles = false;
    } catch (error) {
      this.logger.error(`exception: unable to update user's team and role ${userIdir} - error: ${error}`);
      throw new Error(`exception: unable to get user's team and role ${userIdir} - error: ${error}`);
    }

    return result;
  }

  remove(id: number) {
    return `This action removes a #${id} Team`;
  }
}
