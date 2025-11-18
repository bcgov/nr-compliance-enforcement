import { Resolver, Query, Args } from "@nestjs/graphql";
import { TeamService } from "./team.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("Team")
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}

  @Query("teams")
  @Roles(coreRoles)
  async findAll(@Args("teamCode") teamCode?: string, @Args("agencyCode") agencyCode?: string) {
    return await this.teamService.findAll(teamCode, agencyCode);
  }

  @Query("team")
  @Roles(coreRoles)
  async findOne(@Args("teamGuid") teamGuid: string) {
    return await this.teamService.findOne(teamGuid);
  }
}
