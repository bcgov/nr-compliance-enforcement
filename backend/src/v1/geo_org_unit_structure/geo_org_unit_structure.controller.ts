import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GeoOrgUnitStructureService } from './geo_org_unit_structure.service';
import { CreateGeoOrgUnitStructureDto } from './dto/create-geo_org_unit_structure.dto';
import { UpdateGeoOrgUnitStructureDto } from './dto/update-geo_org_unit_structure.dto';
import { JwtRoleGuard } from 'src/auth/jwtrole.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enum/role.enum';

@ApiTags("geo-org-unit-structure")
@UseGuards(JwtRoleGuard)
@Controller({
  path: 'geo-org-unit-structure',
  version: '1'})
export class GeoOrgUnitStructureController {
  constructor(private readonly geoOrgUnitStructureService: GeoOrgUnitStructureService) {}

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body() createGeoOrgUnitStructureDto: CreateGeoOrgUnitStructureDto) {
    return this.geoOrgUnitStructureService.create(createGeoOrgUnitStructureDto);
  }

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll() {
    return this.geoOrgUnitStructureService.findAll();
  }

  @Get(':id')
  @Roles(Role.COS_OFFICER)
  findOne(@Param('id') id: string) {
    return this.geoOrgUnitStructureService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.COS_OFFICER)
  update(@Param('id') id: string, @Body() updateGeoOrgUnitStructureDto: UpdateGeoOrgUnitStructureDto) {
    return this.geoOrgUnitStructureService.update(+id, updateGeoOrgUnitStructureDto);
  }

  @Delete(':id')
  @Roles(Role.COS_OFFICER)
  remove(@Param('id') id: string) {
    return this.geoOrgUnitStructureService.remove(+id);
  }
}
