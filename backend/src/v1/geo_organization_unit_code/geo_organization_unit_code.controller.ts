import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GeoOrganizationUnitCodeService } from './geo_organization_unit_code.service';
import { CreateGeoOrganizationUnitCodeDto } from './dto/create-geo_organization_unit_code.dto';
import { UpdateGeoOrganizationUnitCodeDto } from './dto/update-geo_organization_unit_code.dto';

@Controller('geo-organization-unit-code')
export class GeoOrganizationUnitCodeController {
  constructor(private readonly geoOrganizationUnitCodeService: GeoOrganizationUnitCodeService) {}

  @Post()
  create(@Body() createGeoOrganizationUnitCodeDto: CreateGeoOrganizationUnitCodeDto) {
    return this.geoOrganizationUnitCodeService.create(createGeoOrganizationUnitCodeDto);
  }

  @Get()
  findAll() {
    return this.geoOrganizationUnitCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.geoOrganizationUnitCodeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGeoOrganizationUnitCodeDto: UpdateGeoOrganizationUnitCodeDto) {
    return this.geoOrganizationUnitCodeService.update(+id, updateGeoOrganizationUnitCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.geoOrganizationUnitCodeService.remove(+id);
  }
}
