import { Resolver, Query } from "@nestjs/graphql";
import { CosGeoOrgUnitService } from "./cos_geo_org_unit.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("CosGeoOrgUnit")
export class CosGeoOrgUnitResolver {
  constructor(private readonly cosGeoOrgUnitService: CosGeoOrgUnitService) {}

  @Query("cosGeoOrgUnits")
  @Roles(coreRoles)
  findAll() {
    return this.cosGeoOrgUnitService.findAll();
  }
}
