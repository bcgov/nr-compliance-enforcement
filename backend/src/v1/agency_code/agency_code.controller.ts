import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AgencyCodeService } from './agency_code.service';
import { CreateAgencyCodeDto } from './dto/create-agency_code.dto';
import { UpdateAgencyCodeDto } from './dto/update-agency_code.dto';
import { JwtRoleGuard } from 'src/auth/jwtrole.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enum/role.enum';

@ApiTags("agency-code")
@UseGuards(JwtRoleGuard)
@Controller({
  path: 'agency-code',
  version: '1'})
export class AgencyCodeController {
  constructor(private readonly agencyCodeService: AgencyCodeService) {}

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body() createAgencyCodeDto: CreateAgencyCodeDto) {
    return this.agencyCodeService.create(createAgencyCodeDto);
  }

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll() {
    return this.agencyCodeService.findAll();
  }

  @Get(':id')
  @Roles(Role.COS_OFFICER)
  findOne(@Param('id') id: string) {
    return this.agencyCodeService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.COS_OFFICER)
  update(@Param('id') id: string, @Body() updateAgencyCodeDto: UpdateAgencyCodeDto) {
    return this.agencyCodeService.update(id, updateAgencyCodeDto);
  }

  @Delete(':id')
  @Roles(Role.COS_OFFICER)
  remove(@Param('id') id: string) {
    return this.agencyCodeService.remove(id);
  }
}
