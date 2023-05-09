import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GeoOrgUnitTypeCodeService } from './geo_org_unit_type_code.service';
import { CreateGeoOrgUnitTypeCodeDto } from './dto/create-geo_org_unit_type_code.dto';
import { UpdateGeoOrgUnitTypeCodeDto } from './dto/update-geo_org_unit_type_code.dto';
import { JwtRoleGuard } from 'src/auth/jwtrole.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enum/role.enum';

@ApiTags("geo-org-unit-type-code")
@UseGuards(JwtRoleGuard)
@Controller({
  path: 'geo-org-unit-type-code',
  version: '1'})
export class GeoOrgUnitTypeCodeController {
  constructor(private readonly geoOrgUnitTypeCodeService: GeoOrgUnitTypeCodeService) {}

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body() createGeoOrgUnitTypeCodeDto: CreateGeoOrgUnitTypeCodeDto) {
    return this.geoOrgUnitTypeCodeService.create(createGeoOrgUnitTypeCodeDto);
  }

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll() {
    return this.geoOrgUnitTypeCodeService.findAll();
  }

  @Get(':id')
  @Roles(Role.COS_OFFICER)
  findOne(@Param('id') id: string) {
    return this.geoOrgUnitTypeCodeService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.COS_OFFICER)
  update(@Param('id') id: string, @Body() updateGeoOrgUnitTypeCodeDto: UpdateGeoOrgUnitTypeCodeDto) {
    return this.geoOrgUnitTypeCodeService.update(id, updateGeoOrgUnitTypeCodeDto);
  }

  @Delete(':id')
  @Roles(Role.COS_OFFICER)
  remove(@Param('id') id: string) {
    return this.geoOrgUnitTypeCodeService.remove(id);
  }
}
