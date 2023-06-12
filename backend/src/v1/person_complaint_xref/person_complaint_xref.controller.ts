import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PersonComplaintXrefService } from './person_complaint_xref.service';
import { CreatePersonComplaintXrefDto } from './dto/create-person_complaint_xref.dto';
import { UpdatePersonComplaintXrefDto } from './dto/update-person_complaint_xref.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtRoleGuard } from 'src/auth/jwtrole.guard';

@UseGuards(JwtRoleGuard)
@ApiTags('person-complaint-xref')
@Controller({
  path: 'person-complaint-xref',
  version: '1'})
export class PersonComplaintXrefController {
  constructor(private readonly personComplaintXrefService: PersonComplaintXrefService) {}

  @Post()
  create(@Body() createPersonComplaintXrefDto: CreatePersonComplaintXrefDto) {
    return this.personComplaintXrefService.create(createPersonComplaintXrefDto);
  }

  @Get()
  findAll() {
    return this.personComplaintXrefService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personComplaintXrefService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonComplaintXrefDto: UpdatePersonComplaintXrefDto) {
    return this.personComplaintXrefService.update(+id, updatePersonComplaintXrefDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personComplaintXrefService.remove(+id);
  }
}
