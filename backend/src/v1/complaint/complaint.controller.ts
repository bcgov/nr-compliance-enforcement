import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { Role } from '../../enum/role.enum';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtRoleGuard } from '../../auth/jwtrole.guard';
import { ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';

@UseGuards(JwtRoleGuard)
@ApiTags("complaint")
@Controller({
  path: 'complaint',
  version: '1'})
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  create(createComplaintDto: CreateComplaintDto) {
    return 'This action adds a new geoOrgUnitStructure';
  }

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll() {
    return this.complaintService.findAll();
  }

  @Get(':id')
  @Roles(Role.COS_OFFICER)
  findOne(@Param('id') id: string) {
    return this.complaintService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.COS_OFFICER)
  update(@Param('id') id: string, @Body() updateComplaintDto: UpdateComplaintDto) {
    return this.complaintService.update(id, updateComplaintDto);
  }

  remove(id: number) {
    return `This action removes a #${id} geoOrgUnitStructure`;
  }
}
