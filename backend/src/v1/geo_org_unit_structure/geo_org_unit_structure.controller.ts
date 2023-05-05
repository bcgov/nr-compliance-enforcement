import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GeoOrgUnitStructureService } from './geo_org_unit_structure.service';
import { CreateGeoOrgUnitStructureDto } from './dto/create-geo_org_unit_structure.dto';
import { UpdateGeoOrgUnitStructureDto } from './dto/update-geo_org_unit_structure.dto';

@Controller('geo-org-unit-structure')
export class GeoOrgUnitStructureController {
  constructor(private readonly geoOrgUnitStructureService: GeoOrgUnitStructureService) {}

  @Post()
  create(@Body() createGeoOrgUnitStructureDto: CreateGeoOrgUnitStructureDto) {
    return this.geoOrgUnitStructureService.create(createGeoOrgUnitStructureDto);
  }

  @Get()
  findAll() {
    return this.geoOrgUnitStructureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.geoOrgUnitStructureService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGeoOrgUnitStructureDto: UpdateGeoOrgUnitStructureDto) {
    return this.geoOrgUnitStructureService.update(+id, updateGeoOrgUnitStructureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.geoOrgUnitStructureService.remove(+id);
  }
}
