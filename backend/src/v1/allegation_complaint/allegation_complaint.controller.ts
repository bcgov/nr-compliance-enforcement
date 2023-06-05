import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AllegationComplaintService } from './allegation_complaint.service';
import { CreateAllegationComplaintDto } from './dto/create-allegation_complaint.dto';
import { UpdateAllegationComplaintDto } from './dto/update-allegation_complaint.dto';
import { JwtRoleGuard } from '../../auth/jwtrole.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../enum/role.enum';
import { UUID } from 'crypto';

@UseGuards(JwtRoleGuard)
@ApiTags("allegation-complaint")
@Controller({
  path: 'allegation-complaint',
  version: '1'})
export class AllegationComplaintController {
  constructor(private readonly allegationComplaintService: AllegationComplaintService) {}

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body() createAllegationComplaintDto: CreateAllegationComplaintDto) {
      return this.allegationComplaintService.create(createAllegationComplaintDto);
  }

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll(@Param('sortColumn') sortColumn: string, @Param('sortOrder') sortOrder: string) {
    return this.allegationComplaintService.findAll(sortColumn, sortOrder);
  }

  @Get(':id')
  @Roles(Role.COS_OFFICER)
  findOne(@Param('id') id: UUID) {
    return this.allegationComplaintService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.COS_OFFICER)
  update(@Param('id') id: UUID, @Body() updateAllegationComplaintDto: UpdateAllegationComplaintDto) {
    return this.allegationComplaintService.update(id, updateAllegationComplaintDto);
  }

  @Delete(':id')
  @Roles(Role.COS_OFFICER)
  remove(@Param('id') id: UUID) {
    return this.allegationComplaintService.remove(id);
  }
}
