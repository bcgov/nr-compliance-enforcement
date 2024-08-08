import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from "@nestjs/common";
import { FeatureAgencyXrefService } from "./feature_agency_xref.service";
import { CreateFeatureAgencyXrefDto } from "./dto/create-feature_agency_xref.dto";
import { UpdateFeatureAgencyXrefDto } from "./dto/update-feature_agency_xref.dto";
import { ApiTags } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/enum/role.enum";

const agencyRoleMap = {
  COS: ["COS Officer", "COS administrator"],
  EPO: ["CEEB", "CEEB Compliance Coordinator", "CEEB Section Head"],
};

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

  @Get()
  @Roles(Role.TEMPORARY_TEST_ADMIN)
  findAll() {
    return this.featureAgencyXrefService.findAll();
  }

  @Get("/feature-flag")
  async getFeatureFlags(@Request() req) {
    const userRoles = req.user.client_roles ?? null;
    let userAgency = [];
    if (userRoles) {
      userRoles.forEach((role) => {
        if (agencyRoleMap.COS.includes(role) && !userAgency.includes("COS")) userAgency.push("COS");
        if (agencyRoleMap.EPO.includes(role) && !userAgency.includes("EPO")) userAgency.push("EPO");
      });
    }
    const result = await Promise.all(
      userAgency.map(async (agency) => {
        return {
          agency,
          features: await this.featureAgencyXrefService.findByAgency(agency),
        };
      }),
    );
    return result;
  }

  @Get("find-by-agency/:agencyCode")
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
