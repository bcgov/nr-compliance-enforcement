import { Controller, Get, UseGuards } from "@nestjs/common";
import { OfficerTeamXrefService } from "./officer_team_xref.service";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../enum/role.enum";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";

@UseGuards(JwtRoleGuard)
@ApiTags("officer-team-xref")
@Controller({
  path: "officer-team-xref",
  version: "1",
})
export class OfficerTeamXrefController {
  constructor(private readonly officerTeamService: OfficerTeamXrefService) {}

  @Get("/all")
  @Roles(Role.TEMPORARY_TEST_ADMIN)
  findAll() {
    return this.officerTeamService.findAll();
  }
}
