import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PersonComplaintXrefCodeService } from './person_complaint_xref_code.service';
import { CreatePersonComplaintXrefCodeDto } from './dto/create-person_complaint_xref_code.dto';
import { UpdatePersonComplaintXrefCodeDto } from './dto/update-person_complaint_xref_code.dto';
import { JwtRoleGuard } from 'src/auth/jwtrole.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enum/role.enum';

@ApiTags("person-complaint-xref-code")
@UseGuards(JwtRoleGuard)
@Controller({
  path: 'person-complaint-xref-code',
  version: '1'})
export class PersonComplaintXrefCodeController {
  constructor(private readonly personComplaintXrefCodeService: PersonComplaintXrefCodeService) {}

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body() createPersonComplaintXrefCodeDto: CreatePersonComplaintXrefCodeDto) {
    return this.personComplaintXrefCodeService.create(createPersonComplaintXrefCodeDto);
  }

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll() {
    return this.personComplaintXrefCodeService.findAll();
  }

  @Get(':id')
  @Roles(Role.COS_OFFICER)
  findOne(@Param('id') id: string) {
    return this.personComplaintXrefCodeService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.COS_OFFICER)
  update(@Param('id') id: string, @Body() updatePersonComplaintXrefCodeDto: UpdatePersonComplaintXrefCodeDto) {
    return this.personComplaintXrefCodeService.update(+id, updatePersonComplaintXrefCodeDto);
  }

  @Delete(':id')
  @Roles(Role.COS_OFFICER)
  remove(@Param('id') id: string) {
    return this.personComplaintXrefCodeService.remove(+id);
  }
}
