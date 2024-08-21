import { Controller, Get, Body, Patch, Param, UseGuards } from "@nestjs/common";
import { OfficerTeamXrefService } from "./officer_team_xref.service";
import { UpdateOfficerTeamXrefDto } from "./dto/update-officer_team_xref.dto";
import { ApiTags } from "@nestjs/swagger";
import { UUID } from "crypto";
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

  // @Get("features-by-agency/:agencyCode")
  // @Roles(Role.TEMPORARY_TEST_ADMIN, Role.CEEB, Role.COS_OFFICER)
  // async findByAgency(@Param("agencyCode") agencyCode: string) {
  //   return await this.officerTeamService.findByAgency(agencyCode);
  // }

  // @Patch(":id")
  // @Roles(Role.TEMPORARY_TEST_ADMIN)
  // update(@Param("id") id: UUID, @Body() updateAttractantHwcrXrefDto: UpdateOfficerTeamXrefDto) {
  //   return this.featureFlagService.update(id, updateAttractantHwcrXrefDto);
  // }
}
