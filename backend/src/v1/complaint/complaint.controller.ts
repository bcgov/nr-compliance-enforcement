import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { Role } from '../../enum/role.enum';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtRoleGuard } from '../../auth/jwtrole.guard';
import { ApiTags } from '@nestjs/swagger';
import { COMPLAINT_TYPE } from '../../types/complaints/complaint-type';
import { WildlifeComplaintDto } from '../../types/models/complaints/wildlife-complaint';
import { AllegationComplaintDto } from '../../types/models/complaints/allegation-complaint';

@UseGuards(JwtRoleGuard)
@ApiTags("complaint")
@Controller({
  path: 'complaint',
  version: '1'})
export class ComplaintController {
  constructor(private readonly service: ComplaintService) {}

  create(createComplaintDto: CreateComplaintDto) {
    return 'This action adds a new geoOrgUnitStructure';
  }

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id')
  @Roles(Role.COS_OFFICER)
  update(@Param('id') id: string, @Body() updateComplaintDto: UpdateComplaintDto) {
    return this.service.update(id, updateComplaintDto);
  }

  remove(id: number) {
    return `This action removes a #${id} geoOrgUnitStructure`;
  }

  //-- refactors starts here
  @Get(":complaintType")
  @Roles(Role.COS_OFFICER)
  async findAllByType(
    @Param("complaintType") complaintType: COMPLAINT_TYPE
  ): Promise<Array<WildlifeComplaintDto | AllegationComplaintDto>> {
    return await this.service.findAllByType(complaintType);
  }
}
