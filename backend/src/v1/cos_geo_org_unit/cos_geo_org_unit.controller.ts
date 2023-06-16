import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CosGeoOrgUnitService } from './cos_geo_org_unit.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { JwtRoleGuard } from 'src/auth/jwtrole.guard';

@ApiTags("cos-geo-org-unit")
@UseGuards(JwtRoleGuard)
@Controller({
  path: 'cos-geo-org-unit',
  version: '1'})
export class CosGeoOrgUnitController {
  constructor(private readonly cosGeoOrgUnitService: CosGeoOrgUnitService) {}

  @Get('/by-region-code/:code')
  @Roles(Role.COS_OFFICER)
  byRegionCode(@Param('code') code: string) {
    return this.cosGeoOrgUnitService.findByRegionCode(code);
  }

  @Get('/by-zone-code/:code')
  @Roles(Role.COS_OFFICER)
  byZoneCode(@Param('code') code: string) {
    return this.cosGeoOrgUnitService.findByZoneCode(code);
  }

  @Get('/by-office-location-code/:code')
  @Roles(Role.COS_OFFICER)
  byOfficeLocationCode(@Param('code') code: string) {
    return this.cosGeoOrgUnitService.findByOfficeLocationCode(code);
  }

  @Get('/by-area-code/:code')
  @Roles(Role.COS_OFFICER)
  byAreaCode(@Param('code') code: string) {
    return this.cosGeoOrgUnitService.findByAreaCode(code);
  }

  @Get('/by-region-name/:name')
  @Roles(Role.COS_OFFICER)
  byRegionName(@Param('name') name: string) {
    return this.cosGeoOrgUnitService.findByRegionName(name);
  }

  @Get('/by-zone-name/:name')
  @Roles(Role.COS_OFFICER)
  byZoneName(@Param('name') name: string) {
    return this.cosGeoOrgUnitService.findByZoneName(name);
  }

  @Get('/by-office-location-name/:name')
  @Roles(Role.COS_OFFICER)
  byOfficeLocationName(@Param('name') code: string) {
    return this.cosGeoOrgUnitService.findByOfficeLocationName(code);
  }

  @Get('/by-area-name/:code')
  @Roles(Role.COS_OFFICER)
  byAreaName(@Param('code') name: string) {
    return this.cosGeoOrgUnitService.findByAreaName(name);
  }
}
