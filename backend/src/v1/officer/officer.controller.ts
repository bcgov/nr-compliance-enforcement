import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OfficerService } from './officer.service';
import { CreateOfficerDto } from './dto/create-officer.dto';
import { UpdateOfficerDto } from './dto/update-officer.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../enum/role.enum';
import { JwtRoleGuard } from '../../auth/jwtrole.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("officer")
@UseGuards(JwtRoleGuard)
@Controller({
  path: 'officer',
  version: '1'})
export class OfficerController {
  constructor(private readonly officerService: OfficerService) {}

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body() createOfficerDto: CreateOfficerDto) {
    return this.officerService.create(createOfficerDto);
  }

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll() {
    return this.officerService.findAll();
  }

  @Get(':id')
  @Roles(Role.COS_OFFICER)
  findOne(@Param('id') id: string) {
    return this.officerService.findOne(+id);
  }

  @Get("/find-by-office/:office_guid")
  @Roles(Role.COS_OFFICER)
  findByOffice(@Param('office_guid') office_guid: string) {
    return this.officerService.findByOffice(office_guid);
  }

  @Patch(':id')
  @Roles(Role.COS_OFFICER)
  update(@Param('id') id: string, @Body() updateOfficerDto: UpdateOfficerDto) {
    return this.officerService.update(+id, updateOfficerDto);
  }

  @Delete(':id')
  @Roles(Role.COS_OFFICER)
  remove(@Param('id') id: string) {
    return this.officerService.remove(+id);
  }
}
