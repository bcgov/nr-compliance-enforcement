import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Logger } from '@nestjs/common';
import { HwcrComplaintService } from './hwcr_complaint.service';
import { CreateHwcrComplaintDto } from './dto/create-hwcr_complaint.dto';
import { UpdateHwcrComplaintDto } from './dto/update-hwcr_complaint.dto';
import { JwtRoleGuard } from '../../auth/jwtrole.guard';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../../enum/role.enum';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UUID } from 'crypto';

@UseGuards(JwtRoleGuard)
@ApiTags("hwcr-complaint")
@Controller({
  path: 'hwcr-complaint',
  version: '1'})
export class HwcrComplaintController {
  constructor(private readonly hwcrComplaintService: HwcrComplaintService) {}

  private readonly logger = new Logger(HwcrComplaintController.name);

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body() createHwcrComplaintDto: CreateHwcrComplaintDto) {
    return this.hwcrComplaintService.create(createHwcrComplaintDto);
  }

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll(@Query('sortColumn') sortColumn: string, @Query('sortOrder') sortOrder: string) {
    this.logger.debug("Entering findAll");
    return this.hwcrComplaintService.findAll(sortColumn, sortOrder);
  }

  @Get(':id')
  @Roles(Role.COS_OFFICER)
  findOne(@Param('id') id: string) {
    return this.hwcrComplaintService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.COS_OFFICER)
  update(@Param('id') id: UUID, @Body() updateHwcrComplaintDto: UpdateHwcrComplaintDto) {
    return this.hwcrComplaintService.update(id, updateHwcrComplaintDto);
  }

  @Delete(':id')
  @Roles(Role.COS_OFFICER)
  remove(@Param('id') id: UUID) {
    return this.hwcrComplaintService.remove(id);
  }
}
