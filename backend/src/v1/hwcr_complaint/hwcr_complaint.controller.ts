import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Logger } from '@nestjs/common';
import { HwcrComplaintService } from './hwcr_complaint.service';
import { JwtRoleGuard } from '../../auth/jwtrole.guard';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../../enum/role.enum';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UUID } from 'crypto';
import { HWCRSearchOptions } from '../../types/complaints/hwcr_search_options';

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
  create (@Body('hwcrComplaint') createHwcrComplaintDto: string) {
    return this.hwcrComplaintService.create(createHwcrComplaintDto);
  }

  @Get('search')
  @Roles(Role.COS_OFFICER)
  search(@Query('sortColumn') sortColumn: string, @Query('sortOrder') sortOrder: string, @Query('community') community: string, @Query('zone') zone: string,
   @Query('region') region: string, @Query('officerAssigned') officerAssigned: string, @Query('natureOfComplaint') natureOfComplaint: string, 
   @Query('speciesCode') speciesCode: string, @Query('incidentReportedStart') incidentReportedStart: Date, @Query('incidentReportedEnd') incidentReportedEnd: Date, @Query('status') status,
   @Query('page') page: number, @Query('pageSize') pageSize: number) {
    const options: HWCRSearchOptions = {
      community: community,
      zone: zone,
      region: region,
      officerAssigned: officerAssigned,
      natureOfComplaint: natureOfComplaint,
      speciesCode: speciesCode,
      incidentReportedStart: incidentReportedStart,
      incidentReportedEnd: incidentReportedEnd,
      status: status,
    };
    return this.hwcrComplaintService.search(sortColumn, sortOrder, options, page, pageSize);
  }

  @Get('map/search')
  @Roles(Role.COS_OFFICER)
  searchMap(@Query('sortColumn') sortColumn: string, @Query('sortOrder') sortOrder: string, @Query('community') community: string, @Query('zone') zone: string,
   @Query('region') region: string, @Query('officerAssigned') officerAssigned: string, @Query('natureOfComplaint') natureOfComplaint: string, 
   @Query('speciesCode') speciesCode: string, @Query('incidentReportedStart') incidentReportedStart: Date, @Query('incidentReportedEnd') incidentReportedEnd: Date, @Query('status') status) {


    const options: HWCRSearchOptions = {
      community: community,
      zone: zone,
      region: region,
      officerAssigned: officerAssigned,
      natureOfComplaint: natureOfComplaint,
      speciesCode: speciesCode,
      incidentReportedStart: incidentReportedStart,
      incidentReportedEnd: incidentReportedEnd,
      status: status,
    };
    return this.hwcrComplaintService.searchMap(sortColumn, sortOrder, options);
  }

  @Patch(':id')
  @Roles(Role.COS_OFFICER)
  async update(@Param('id') id: UUID, @Body('hwcrComplaint') updateHwcrComplaintDto: string) {
    const hwcrComplaint = await this.hwcrComplaintService.update(id, updateHwcrComplaintDto);
    return hwcrComplaint;
  }

  @Delete(':id')
  @Roles(Role.COS_OFFICER)
  remove(@Param('id') id: UUID) {
    return this.hwcrComplaintService.remove(id);
  }

  @Get('/by-complaint-identifier/:id')
  @Roles(Role.COS_OFFICER)
  byId(@Param('id') id: string) {
    return this.hwcrComplaintService.findByComplaintIdentifier(id);
  }

  @Get("/stats/by-zone/:zone")
  @Roles(Role.COS_OFFICER)
  statsByZone(@Param("zone") zone: string) { 
    return this.hwcrComplaintService.getZoneAtAGlanceStatistics(zone);
  }
}
