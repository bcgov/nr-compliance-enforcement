import { Resolver, Query } from "@nestjs/graphql";
import { GeoOrganizationUnitCodeService } from "./geo_organization_unit_code.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("GeoOrganizationUnitCode")
export class GeoOrganizationUnitCodeResolver {
  constructor(private readonly geoOrganizationUnitCodeService: GeoOrganizationUnitCodeService) {}

  @Query("geoOrganizationUnitCodes")
  @Roles(coreRoles)
  findAll() {
    return this.geoOrganizationUnitCodeService.findAll();
  }
}
