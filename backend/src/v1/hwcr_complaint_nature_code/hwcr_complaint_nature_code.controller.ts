import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { HwcrComplaintNatureCodeService } from './hwcr_complaint_nature_code.service';
import { CreateHwcrComplaintNatureCodeDto } from './dto/create-hwcr_complaint_nature_code.dto';
import { UpdateHwcrComplaintNatureCodeDto } from './dto/update-hwcr_complaint_nature_code.dto';
import { JwtRoleGuard } from '../../auth/jwtrole.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../enum/role.enum';

@ApiTags("hwcr-complaint-nature-code")
@UseGuards(JwtRoleGuard)
@Controller({
  path: 'hwcr-complaint-nature-code',
  version: '1'})
export class HwcrComplaintNatureCodeController {
  constructor(private readonly hwcrComplaintNatureCodeService: HwcrComplaintNatureCodeService) {}

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body() createHwcrComplaintNatureCodeService: CreateHwcrComplaintNatureCodeDto) {
    return this.hwcrComplaintNatureCodeService.create(createHwcrComplaintNatureCodeService);
  }

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll() {
    return this.hwcrComplaintNatureCodeService.findAll();
  }

  @Get(':id')
  @Roles(Role.COS_OFFICER)
  findOne(@Param('id') id: string) {
    return this.hwcrComplaintNatureCodeService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.COS_OFFICER)
  update(@Param('id') id: string, @Body() updateHwcrComplaintNatureCodeService: UpdateHwcrComplaintNatureCodeDto) {
    return this.hwcrComplaintNatureCodeService.update(id, updateHwcrComplaintNatureCodeService);
  }

  @Delete(':id')
  @Roles(Role.COS_OFFICER)
  remove(@Param('id') id: string) {
    return this.hwcrComplaintNatureCodeService.remove(id);
  }
}
