import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { FeatureAgencyXrefService } from "./feature_agency_xref.service";
import { CreateFeatureAgencyXrefDto } from "./dto/create-feature_agency_xref.dto";
import { UpdateFeatureAgencyXrefDto } from "./dto/update-feature_agency_xref.dto";
import { ApiTags } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../enum/role.enum";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";

@UseGuards(JwtRoleGuard)
@ApiTags("feature-agency-xref")
@Controller({
  path: "feature-agency-xref",
  version: "1",
})
export class FeatureAgencyXrefController {
  constructor(private readonly featureAgencyXrefService: FeatureAgencyXrefService) {}

  @Get("/all")
  @Roles(Role.TEMPORARY_TEST_ADMIN)
  findAll() {
    return this.featureAgencyXrefService.findAll();
  }

  @Get("features-by-agency/:agencyCode")
  @Roles(Role.TEMPORARY_TEST_ADMIN, Role.CEEB, Role.COS_OFFICER)
  async findByAgency(@Param("agencyCode") agencyCode: string) {
    return await this.featureAgencyXrefService.findByAgency(agencyCode);
  }

  @Patch(":id")
  @Roles(Role.TEMPORARY_TEST_ADMIN)
  update(@Param("id") id: UUID, @Body() updateAttractantHwcrXrefDto: UpdateFeatureAgencyXrefDto) {
    return this.featureAgencyXrefService.update(id, updateAttractantHwcrXrefDto);
  }
}
