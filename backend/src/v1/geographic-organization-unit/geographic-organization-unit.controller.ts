import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GeographicOrganizationUnitService } from './geographic-organization-unit.service';
import { CreateGeographicOrganizationUnitDto } from './dto/create-geographic-organization-unit.dto';
import { UpdateGeographicOrganizationUnitDto } from './dto/update-geographic-organization-unit.dto';

@Controller('geographic-organization-unit')
export class GeographicOrganizationUnitController {
  constructor(private readonly geographicOrganizationUnitService: GeographicOrganizationUnitService) {}

  @Post()
  create(@Body() createGeographicOrganizationUnitDto: CreateGeographicOrganizationUnitDto) {
    return this.geographicOrganizationUnitService.create(createGeographicOrganizationUnitDto);
  }

  @Get()
  findAll() {
    return this.geographicOrganizationUnitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.geographicOrganizationUnitService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGeographicOrganizationUnitDto: UpdateGeographicOrganizationUnitDto) {
    return this.geographicOrganizationUnitService.update(+id, updateGeographicOrganizationUnitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.geographicOrganizationUnitService.remove(+id);
  }
}
