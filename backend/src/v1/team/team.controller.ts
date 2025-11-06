import { Controller, Get, Body, Patch, Param, UseGuards, Query } from "@nestjs/common";
import { TeamService } from "./team.service";
import { ApiTags } from "@nestjs/swagger";
import { UUID } from "node:crypto";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../enum/role.enum";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { TeamUpdate } from "src/types/models/general/team-update";
import { Token } from "../../auth/decorators/token.decorator";

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
  async findCurrentTeam(@Query("appUserGuid") appUserGuid: UUID, @Token() token: string) {
    return await this.teamService.findUserCurrentTeam(appUserGuid, token);
  }

  @Patch("update/:app_user_guid")
  @Roles(Role.TEMPORARY_TEST_ADMIN)
  update(@Param("app_user_guid") appUserGuid: UUID, @Body() updateTeamData: TeamUpdate, @Token() token: string) {
    return this.teamService.update(appUserGuid, updateTeamData, token);
  }
}
