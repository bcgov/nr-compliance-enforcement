import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OfficeService } from './office.service';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { JwtRoleGuard } from '../../auth/jwtrole.guard';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../../enum/role.enum';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UUID } from 'crypto';

@ApiTags("office")
@UseGuards(JwtRoleGuard)
@Controller({
  path: 'office',
  version: '1'})
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body() createOfficeDto: CreateOfficeDto) {
    return this.officeService.create(createOfficeDto);
  }

  @Get()
  @Roles(Role.COS_OFFICER)
  findByGeoOrgCode(@Param('geo_organization_code') geo_organization_code: string) {
    return this.officeService.findByGeoOrgCode(+geo_organization_code);
  }

  @Get("/by-zone/:zone_code")
  @Roles(Role.COS_OFFICER)
  findOfficesByZone(@Param('zone_code') zone_code: string)
  {
    return this.officeService.findOfficesByZone(zone_code);
  }

  @Get(':id')
  @Roles(Role.COS_OFFICER)
  findOne(@Param('id') id: UUID) {
    return this.officeService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.COS_OFFICER)
  update(@Param('id') id: string, @Body() updateOfficeDto: UpdateOfficeDto) {
    return this.officeService.update(+id, updateOfficeDto);
  }

  @Delete(':id')
  @Roles(Role.COS_OFFICER)
  remove(@Param('id') id: string) {
    return this.officeService.remove(+id);
  }
}
