import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Logger,
} from "@nestjs/common";
import { AllegationComplaintService } from "./allegation_complaint.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../enum/role.enum";
import { UUID } from "crypto";
import { AllegationSearchOptions } from "../../types/complaints/allegation_search_options";

@UseGuards(JwtRoleGuard)
@ApiTags("allegation-complaint")
@Controller({
  path: "allegation-complaint",
  version: "1",
})
export class AllegationComplaintController {
  constructor(
    private readonly allegationComplaintService: AllegationComplaintService
  ) {}

  private readonly logger = new Logger(AllegationComplaintController.name);

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body('allegationComplaint') createAllegationComplaintDto: string) {
    return this.allegationComplaintService.create(createAllegationComplaintDto);
  }

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll(
    @Query("sortColumn") sortColumn: string,
    @Query("sortOrder") sortOrder: string
  ) {
    return this.allegationComplaintService.findAll(sortColumn, sortOrder);
  }

  @Get("search")
  @Roles(Role.COS_OFFICER)
  search(
    @Query("sortColumn") sortColumn: string,
    @Query("sortOrder") sortOrder: string,
    @Query("community") community: string,
    @Query("zone") zone: string,
    @Query("region") region: string,
    @Query("officerAssigned") officerAssigned: string,
    @Query("violationCode") violationCode: string,
    @Query("incidentReportedStart") incidentReportedStart: string,
    @Query("incidentReportedEnd") incidentReportedEnd: string,
    @Query("status") status,
    @Query('page') page: number, 
    @Query('pageSize') pageSize: number) {

    const options: AllegationSearchOptions = {
      community: community,
      zone: zone,
      region: region,
      officerAssigned: officerAssigned,
      violationCode: violationCode,
      incidentReportedStart: incidentReportedStart,
      incidentReportedEnd: incidentReportedEnd,
      status: status,
    };

    return this.allegationComplaintService.search(
      sortColumn,
      sortOrder,
      options,
      page,
      pageSize,
    );
  }

  @Get("map/search")
  @Roles(Role.COS_OFFICER)
  searchMap(
    @Query("sortColumn") sortColumn: string,
    @Query("sortOrder") sortOrder: string,
    @Query("community") community: string,
    @Query("zone") zone: string,
    @Query("region") region: string,
    @Query("officerAssigned") officerAssigned: string,
    @Query("violationCode") violationCode: string,
    @Query("incidentReportedStart") incidentReportedStart: string,
    @Query("incidentReportedEnd") incidentReportedEnd: string,
    @Query("status") status
  ) {

    const options: AllegationSearchOptions = {
      community: community,
      zone: zone,
      region: region,
      officerAssigned: officerAssigned,
      violationCode: violationCode,
      incidentReportedStart: incidentReportedStart,
      incidentReportedEnd: incidentReportedEnd,
      status: status,
    };

    return this.allegationComplaintService.searchMap(
      sortColumn,
      sortOrder,
      options,
    );
  }

  @Get(":id")
  @Roles(Role.COS_OFFICER)
  findOne(@Param("id") id: UUID) {
    return this.allegationComplaintService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.COS_OFFICER)
  update(@Param('id') id: UUID, @Body('allegationComplaint') updateAllegationComplaintDto: string) {
    return this.allegationComplaintService.update(id, updateAllegationComplaintDto);
  }

  @Delete(":id")
  @Roles(Role.COS_OFFICER)
  remove(@Param("id") id: UUID) {
    return this.allegationComplaintService.remove(id);
  }

  @Get("/by-complaint-identifier/:id")
  @Roles(Role.COS_OFFICER)
  byId(@Param("id") id: string) {
    return this.allegationComplaintService.findByComplaintIdentifier(id);
  }

  @Get("/stats/by-zone/:zone")
  @Roles(Role.COS_OFFICER)
  statsByZone(@Param("zone") zone: string) {
    return this.allegationComplaintService.getZoneAtAGlanceStatistics(zone);
  }
}
