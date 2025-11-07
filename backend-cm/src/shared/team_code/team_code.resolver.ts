import { Resolver, Query } from "@nestjs/graphql";
import { TeamCodeService } from "./team_code.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("TeamCode")
export class TeamCodeResolver {
  constructor(private readonly teamCodeService: TeamCodeService) {}

  @Query("teamCodes")
  @Roles(coreRoles)
  findAll() {
    return this.teamCodeService.findAll();
  }
}
