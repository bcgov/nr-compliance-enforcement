import { Controller, Get, Body, Patch, Param, UseGuards, Query } from "@nestjs/common";
import { TeamService } from "./team.service";
import { ApiTags } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../enum/role.enum";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";

@UseGuards(JwtRoleGuard)
@ApiTags("team")
@Controller({
  path: "team",
  version: "1",
})
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get("find-user")
  @Roles(Role.TEMPORARY_TEST_ADMIN)
  findUserIdir(@Query("firstName") firstName: string, @Query("lastName") lastName: string) {
    return this.teamService.findUserIdir(firstName, lastName);
  }

  @Get("current")
  @Roles(Role.TEMPORARY_TEST_ADMIN)
  async findCurrentTeamAndRole(@Query("userIdir") userIdir: string, @Query("officerGuid") officerGuid: UUID) {
    let result = {
      agency: null,
      team: null,
      roles: null,
    };
    const currentRoles = await this.teamService.findUserCurrentRoles(userIdir);
    result.roles = currentRoles;
    //@ts-ignore
    const hasCEEBRole = currentRoles.findIndex(
      (role) =>
        role.name === Role.CEEB ||
        role.name === Role.CEEB_COMPLIANCE_COORDINATOR ||
        role.name === Role.CEEB_SECTION_HEAD,
    );
    if (hasCEEBRole > -1) {
      result.agency = "EPO";
      result.team = await this.teamService.findUserCurrentTeam(officerGuid);
    }
    //@ts-ignore
    const hasCOSRole = currentRoles.findIndex(
      (role: any) => role.name === Role.COS_ADMINISTRATOR || role.name === Role.COS_OFFICER,
    );
    if (hasCOSRole > -1) {
      result.agency = "COS";
    }
    return result;
  }

  @Patch("update/:officer_guid")
  @Roles(Role.TEMPORARY_TEST_ADMIN)
  update(@Param("officer_guid") officerGuid: UUID, @Body() updateTeamData: any) {
    return this.teamService.update(officerGuid, updateTeamData);
  }
}
