import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GeoOrganizationUnitCodeService } from './geo_organization_unit_code.service';
import { CreateGeoOrganizationUnitCodeDto } from './dto/create-geo_organization_unit_code.dto';
import { UpdateGeoOrganizationUnitCodeDto } from './dto/update-geo_organization_unit_code.dto';
import { JwtRoleGuard } from '../../auth/jwtrole.guard';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../../enum/role.enum';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags("geo-organization-unit-code")
@UseGuards(JwtRoleGuard)
@Controller({
  path: 'geo-organization-unit-code',
  version: '1'})
export class GeoOrganizationUnitCodeController {
  constructor(private readonly geoOrganizationUnitCodeService: GeoOrganizationUnitCodeService) {}

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body() createGeoOrganizationUnitCodeDto: CreateGeoOrganizationUnitCodeDto) {
    return this.geoOrganizationUnitCodeService.create(createGeoOrganizationUnitCodeDto);
  }

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll() {
    return this.geoOrganizationUnitCodeService.findAll();
  }

  @Get('/find-all-regions/')
  @Roles(Role.COS_OFFICER)
  findRegions() {
    return this.geoOrganizationUnitCodeService.findDistinctGeoCodes("REGION");
  }

  @Get('/find-all-zones/')
  @Roles(Role.COS_OFFICER)
  findZones() {
    return this.geoOrganizationUnitCodeService.findDistinctGeoCodes("ZONE");
  }

  @Get('/find-all-areas/')
  @Roles(Role.COS_OFFICER)
  findAreas() {
    return this.geoOrganizationUnitCodeService.findDistinctGeoCodes("AREA");
  }

  @Get(':id')
  @Roles(Role.COS_OFFICER)
  findOne(@Param('id') id: string) {
    return this.geoOrganizationUnitCodeService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.COS_OFFICER)
  update(@Param('id') id: string, @Body() updateGeoOrganizationUnitCodeDto: UpdateGeoOrganizationUnitCodeDto) {
    return this.geoOrganizationUnitCodeService.update(id, updateGeoOrganizationUnitCodeDto);
  }

  @Delete(':id')
  @Roles(Role.COS_OFFICER)
  remove(@Param('id') id: string) {
    return this.geoOrganizationUnitCodeService.remove(id);
  }
}
