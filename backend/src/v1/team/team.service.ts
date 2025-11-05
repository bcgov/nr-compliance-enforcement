import { Inject, Injectable, Logger } from "@nestjs/common";
import { CssService } from "../../external_api/css/css.service";
import { Role } from "../../enum/role.enum";
import { TeamUpdate } from "../../types/models/general/team-update";
import {
  getTeams,
  getTeamByGuid,
  updateAppUser,
  getAppUserTeamXref,
  createAppUserTeamXref,
  updateAppUserTeamXref,
  deleteAppUserTeamXref,
} from "../../external_api/shared_data";

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);

  constructor(@Inject(CssService) private readonly cssService: CssService) {}

  async findAll(token: string): Promise<any[]> {
    const teams = await getTeams(token);
    return teams;
  }

  async findOne(id: any, token: string): Promise<any> {
    const team = await getTeamByGuid(token, id);

    if (!team) {
      throw new Error("Team not found");
    }

    return team;
  }

  async findByTeamCodeAndAgencyCode(teamCode: any, agencyCode: string, token: string) {
    const teams = await getTeams(token, teamCode, agencyCode);

    if (teams.length === 0) {
      throw new Error("Team not found");
    }

    return teams[0].teamGuid;
  }

  async findUserIdir(firstName: string, lastName: string) {
    const userIdir = await this.cssService.getUserIdirByName(firstName, lastName);
    return userIdir;
  }

  async findUserCurrentRoles(userIdir: string): Promise<{ name: string; composite: string }[]> {
    const currentRoles = await this.cssService.getUserRoles(userIdir);
    return currentRoles;
  }

  async findUserCurrentTeam(appUserGuid: string, token: string) {
    const teamXref = await getAppUserTeamXref(token, appUserGuid);

    if (!teamXref) {
      return null;
    }

    const team = await getTeamByGuid(token, teamXref.teamGuid);

    return {
      ...teamXref,
      team_guid: team,
    };
  }

  async update(appUserGuid: string, updateTeamData: TeamUpdate, token: string) {
    let result = {
      team: false,
      roles: false,
    };
    const { teamCode, agencyCode, userIdir, roles: updateRoles, adminIdirUsername } = updateTeamData;

    try {
      // Update the app user's agency
      await updateAppUser(token, appUserGuid, { agencyCode });

      // Get current team assignment
      const currentTeamXref = await getAppUserTeamXref(token, appUserGuid);

      // Handle team assignment
      if (!teamCode) {
        // Remove team assignment if teamCode is null
        if (currentTeamXref) {
          await deleteAppUserTeamXref(token, currentTeamXref.appUserTeamXrefGuid);
          result.team = true;
        }
      } else {
        const teamGuid = await this.findByTeamCodeAndAgencyCode(teamCode, agencyCode, token);
        // Set user's office_guid to null because CEEB user doesn't have an office
        await updateAppUser(token, appUserGuid, { officeGuid: null });

        if (currentTeamXref) {
          // Update existing team assignment
          await updateAppUserTeamXref(token, appUserGuid, {
            teamGuid,
            activeIndicator: true,
          });
          result.team = true;
        } else {
          // Create new team assignment
          await createAppUserTeamXref(token, {
            appUserGuid: appUserGuid,
            teamGuid,
            activeIndicator: true,
          });
          result.team = true;
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
