import { Inject, Injectable, Logger } from "@nestjs/common";
import { Team } from "./entities/team.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CssService } from "../../external_api/css/css.service";
import { OfficerTeamXref } from "../officer_team_xref/entities/officer_team_xref.entity";
import { Role } from "../../enum/role.enum";

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);

  @InjectRepository(Team)
  private teamRepository: Repository<Team>;
  @InjectRepository(OfficerTeamXref)
  private officerTeamXrefRepository: Repository<OfficerTeamXref>;
  @Inject(CssService)
  private readonly cssService: CssService;

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
      relations: {
        team_code: true,
        agency_code: true,
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
    const officerTeamXref = await this.officerTeamXrefRepository.findOne({
      where: { officer_guid: officerGuid },
      relations: { team_guid: { team_code: true } },
    });
    if (officerTeamXref) {
      return {
        value: officerTeamXref.team_guid.team_code.team_code,
        label: officerTeamXref.team_guid.team_code.short_description,
      };
    } else {
      return null;
    }
  }

  async update(officerGuid, updateTeamData) {
    let result = {
      team: false,
      roles: false,
    };
    const { teamCode, agencyCode, userIdir, roles: updateRoles } = updateTeamData;
    try {
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
        if (officerTeamXref) {
          const updateEnity = {
            team_guid: teamGuid,
            active_ind: true,
            update_user_id: "postgres",
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
            create_user_id: "postgres",
            update_user_id: "postgres",
          };
          const newRecord = await this.officerTeamXrefRepository.create(newEntity);
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
