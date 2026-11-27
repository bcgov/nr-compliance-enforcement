import { Resolver, Query, Args } from "@nestjs/graphql";
import { CosGeoOrgUnitService } from "./cos_geo_org_unit.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { JwtOrApiKeyGuard } from "../../auth/jwt-or-apikey.guard";
import { UseGuards } from "@nestjs/common";
import { adminRoles, coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@Resolver("CosGeoOrgUnit")
export class CosGeoOrgUnitResolver {
  constructor(private readonly cosGeoOrgUnitService: CosGeoOrgUnitService) {}

  @Query("cosGeoOrgUnits")
  @UseGuards(JwtOrApiKeyGuard)
  @Roles(coreRoles, adminRoles)
  async findAll(
    @Args("zoneCode") zoneCode?: string,
    @Args("regionCode") regionCode?: string,
    @Args("distinctOfficeLocations") distinctOfficeLocations?: boolean,
  ) {
    return await this.cosGeoOrgUnitService.findAll(zoneCode, regionCode, distinctOfficeLocations);
  }

  @Query("searchCosGeoOrgUnitsByNames")
  @UseGuards(JwtRoleGuard)
  @Roles(coreRoles)
  async searchByNames(
    @Args("regionName") regionName?: string,
    @Args("zoneName") zoneName?: string,
    @Args("areaName") areaName?: string,
    @Args("officeLocationName") officeLocationName?: string,
    @Args("distinctOfficeLocations") distinctOfficeLocations?: boolean,
  ) {
    return await this.cosGeoOrgUnitService.searchByNames(
      regionName,
      zoneName,
      areaName,
      officeLocationName,
      distinctOfficeLocations,
    );
  }
}
