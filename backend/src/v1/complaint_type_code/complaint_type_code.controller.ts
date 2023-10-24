import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ComplaintTypeCodeService } from './complaint_type_code.service';
import { CreateComplaintTypeCodeDto } from './dto/create-complaint_type_code.dto';
import { UpdateComplaintTypeCodeDto } from './dto/update-complaint_type_code.dto';
import { JwtRoleGuard } from '../../auth/jwtrole.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../enum/role.enum';

@ApiTags("complaint-type-code")
@UseGuards(JwtRoleGuard)
@Controller({
  path: 'complaint-type-code',
  version: '1'})
export class ComplaintTypeCodeController {
  constructor(private readonly complaintTypeCodeService: ComplaintTypeCodeService) {}

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body() createAgencyCodeDto: CreateComplaintTypeCodeDto) {
    return this.complaintTypeCodeService.create(createAgencyCodeDto);
  }

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll() {
    return this.complaintTypeCodeService.findAll();
  }

  @Get(':id')
  @Roles(Role.COS_OFFICER)
  findOne(@Param('id') id: string) {
    return this.complaintTypeCodeService.findOne({where: {complaint_type_code: id}});
  }

  @Patch(':id')
  @Roles(Role.COS_OFFICER)
  update(@Param('id') id: string, @Body() updateComplaintTypeCodeDto: UpdateComplaintTypeCodeDto) {
    return this.complaintTypeCodeService.update(id, updateComplaintTypeCodeDto);
  }

  @Delete(':id')
  @Roles(Role.COS_OFFICER)
  remove(@Param('id') id: string) {
    return this.complaintTypeCodeService.remove(id);
  }
}
