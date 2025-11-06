import { Controller, Get, Body, Patch, Param, UseGuards } from "@nestjs/common";
import { FeatureFlagService } from "./feature_flag.service";
import { UpdateFeatureAgencyXrefDto } from "./dto/update-feature_agency_xref.dto";
import { ApiTags } from "@nestjs/swagger";
import { UUID } from "node:crypto";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role, coreRoles } from "../../enum/role.enum";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";

@UseGuards(JwtRoleGuard)
@ApiTags("feature-flag")
@Controller({
  path: "feature-flag",
  version: "1",
})
export class FeatureFlagController {
  constructor(private readonly featureFlagService: FeatureFlagService) {}

  @Get("/all")
  @Roles(Role.TEMPORARY_TEST_ADMIN)
  findAll() {
    return this.featureFlagService.findAll();
  }

  @Get("features-by-agency/:agencyCode")
  @Roles(Role.TEMPORARY_TEST_ADMIN, coreRoles)
  async findByAgency(@Param("agencyCode") agencyCode: string) {
    return await this.featureFlagService.findByAgency(agencyCode);
  }

  @Patch(":id")
  @Roles(Role.TEMPORARY_TEST_ADMIN)
  update(@Param("id") id: UUID, @Body() updateAttractantHwcrXrefDto: UpdateFeatureAgencyXrefDto) {
    return this.featureFlagService.update(id, updateAttractantHwcrXrefDto);
  }
}
