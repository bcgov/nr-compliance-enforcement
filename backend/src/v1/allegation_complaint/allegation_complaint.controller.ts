import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AllegationComplaintService } from './allegation_complaint.service';
import { CreateAllegationComplaintDto } from './dto/create-allegation_complaint.dto';
import { UpdateAllegationComplaintDto } from './dto/update-allegation_complaint.dto';
import { JwtRoleGuard } from 'src/auth/jwtrole.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { UUID } from 'crypto';
import { ComplaintDto } from '../complaint/dto/complaint.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags("allegation-complaint")
@Controller({
  path: 'allegation-complaint',
  version: '1'})
export class AllegationComplaintController {
  complaint: ComplaintDto;
  constructor(private readonly allegationComplaintService: AllegationComplaintService) {}

  @Post()
  @Public()
  create(@Body() createAllegationComplaintDto: CreateAllegationComplaintDto) {
      return this.allegationComplaintService.create(createAllegationComplaintDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.allegationComplaintService.findAll();
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
