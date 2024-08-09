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

  @Post()
  create(@Body() createFeatureAgencyXrefDto: CreateFeatureAgencyXrefDto) {
    //this endpoint should not be implemented.
    return "create";
  }

  @Get("/all")
  @Roles(Role.TEMPORARY_TEST_ADMIN)
  findAll() {
    return this.featureAgencyXrefService.findAll();
  }

  @Get("features-by-agency/:agencyCode")
  async findByAgency(@Param("agencyCode") agencyCode: string) {
    return await this.featureAgencyXrefService.findByAgency(agencyCode);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.featureAgencyXrefService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: UUID, @Body() updateAttractantHwcrXrefDto: UpdateFeatureAgencyXrefDto) {
    return this.featureAgencyXrefService.update(id, updateAttractantHwcrXrefDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.featureAgencyXrefService.remove(+id);
  }
}
