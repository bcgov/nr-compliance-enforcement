import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ComplaintStatusCodeService } from './complaint_status_code.service';
import { CreateComplaintStatusCodeDto } from './dto/create-complaint_status_code.dto';
import { UpdateComplaintStatusCodeDto } from './dto/update-complaint_status_code.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtRoleGuard } from '../../auth/jwtrole.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../enum/role.enum';

@ApiTags("complaint-status-code")
@UseGuards(JwtRoleGuard)
@Controller({
  path: 'complaint-status-code',
  version: '1'})
export class ComplaintStatusCodeController {
  constructor(private readonly complaintStatusCodeService: ComplaintStatusCodeService) {}

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body() createComplaintStatusCodeDto: CreateComplaintStatusCodeDto) {
    return this.complaintStatusCodeService.create(createComplaintStatusCodeDto);
  }

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll() {
    return this.complaintStatusCodeService.findAll();
  }

  @Get(':id')
  @Roles(Role.COS_OFFICER)
  findOne(@Param('id') id: string) {
    return this.complaintStatusCodeService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.COS_OFFICER)
  update(@Param('id') id: string, @Body() updateComplaintStatusCodeDto: UpdateComplaintStatusCodeDto) {
    return this.complaintStatusCodeService.update(id, updateComplaintStatusCodeDto);
  }

  @Delete(':id')
  @Roles(Role.COS_OFFICER)
  remove(@Param('id') id: string) {
    return this.complaintStatusCodeService.remove(id);
  }
}
