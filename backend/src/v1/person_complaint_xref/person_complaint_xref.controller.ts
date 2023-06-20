import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PersonComplaintXrefService } from './person_complaint_xref.service';
import { CreatePersonComplaintXrefDto } from './dto/create-person_complaint_xref.dto';
import { UpdatePersonComplaintXrefDto } from './dto/update-person_complaint_xref.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtRoleGuard } from 'src/auth/jwtrole.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { UUID } from 'crypto';

@UseGuards(JwtRoleGuard)
@ApiTags('person-complaint-xref')
@Controller({
  path: 'person-complaint-xref',
  version: '1'})
export class PersonComplaintXrefController {
  constructor(private readonly personComplaintXrefService: PersonComplaintXrefService) {}

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body() createPersonComplaintXrefDto: CreatePersonComplaintXrefDto) {
    return this.personComplaintXrefService.create(createPersonComplaintXrefDto);
  }

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll() {
    return this.personComplaintXrefService.findAll();
  }

  @Get(':id')
  @Roles(Role.COS_OFFICER)
  findOne(@Param('id') id: UUID) {
    return this.personComplaintXrefService.findOne(id);
  }

  @Get('/find-by-complaint/:id')
  @Roles(Role.COS_OFFICER)
  findOneByComplaint(@Param('id') id: string) {
    return this.personComplaintXrefService.findByComplaint(id);
  }

  @Patch(':id')
  @Roles(Role.COS_OFFICER)
  update(@Param('id') id: UUID, @Body() updatePersonComplaintXrefDto: UpdatePersonComplaintXrefDto) {
    return this.personComplaintXrefService.update(id, updatePersonComplaintXrefDto);
  }

  @Delete(':id')
  remove(@Param('id') id: UUID) {
    return this.personComplaintXrefService.remove(id);
  }
}
