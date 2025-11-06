import { Resolver, Query } from "@nestjs/graphql";
import { GeoOrgUnitTypeCodeService } from "./geo_org_unit_type_code.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("GeoOrgUnitTypeCode")
export class GeoOrgUnitTypeCodeResolver {
  constructor(private readonly geoOrgUnitTypeCodeService: GeoOrgUnitTypeCodeService) {}

  @Query("geoOrgUnitTypeCodes")
  @Roles(coreRoles)
  findAll() {
    return this.geoOrgUnitTypeCodeService.findAll();
  }
}
