import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GeoOrgUnitTypeCodeService } from './geo_org_unit_type_code.service';
import { CreateGeoOrgUnitTypeCodeDto } from './dto/create-geo_org_unit_type_code.dto';
import { UpdateGeoOrgUnitTypeCodeDto } from './dto/update-geo_org_unit_type_code.dto';

@Controller('geo-org-unit-type-code')
export class GeoOrgUnitTypeCodeController {
  constructor(private readonly geoOrgUnitTypeCodeService: GeoOrgUnitTypeCodeService) {}

  @Post()
  create(@Body() createGeoOrgUnitTypeCodeDto: CreateGeoOrgUnitTypeCodeDto) {
    return this.geoOrgUnitTypeCodeService.create(createGeoOrgUnitTypeCodeDto);
  }

  @Get()
  findAll() {
    return this.geoOrgUnitTypeCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.geoOrgUnitTypeCodeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGeoOrgUnitTypeCodeDto: UpdateGeoOrgUnitTypeCodeDto) {
    return this.geoOrgUnitTypeCodeService.update(+id, updateGeoOrgUnitTypeCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.geoOrgUnitTypeCodeService.remove(+id);
  }
}
