import { Controller, Get, Body, Patch, Param, UseGuards, Post, Query } from "@nestjs/common";
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
    console.log(firstName, lastName);
    return this.teamService.findUserIdir(firstName, lastName);
  }

  @Patch("update/:officer_guid")
  @Roles(Role.TEMPORARY_TEST_ADMIN)
  update(@Param("officer_guid") officerGuid: UUID, @Body() updateTeamData: any) {
    return this.teamService.update(officerGuid, updateTeamData);
  }
}
