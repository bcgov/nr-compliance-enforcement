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
import { CreateAllegationComplaintDto } from "./dto/create-allegation_complaint.dto";
import { UpdateAllegationComplaintDto } from "./dto/update-allegation_complaint.dto";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../enum/role.enum";
import { UUID } from "crypto";

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
  create(@Body() createAllegationComplaintDto: CreateAllegationComplaintDto) {
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
    return this.allegationComplaintService.search(
      sortColumn,
      sortOrder,
      community,
      zone,
      region,
      officerAssigned,
      violationCode,
      incidentReportedStart,
      incidentReportedEnd,
      status,
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
    return this.allegationComplaintService.searchMap(
      sortColumn,
      sortOrder,
      community,
      zone,
      region,
      officerAssigned,
      violationCode,
      incidentReportedStart,
      incidentReportedEnd,
      status,
    );
  }

  @Get(":id")
  @Roles(Role.COS_OFFICER)
  findOne(@Param("id") id: UUID) {
    return this.allegationComplaintService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.COS_OFFICER)
  update(
    @Param("id") id: UUID,
    @Body() updateAllegationComplaintDto: UpdateAllegationComplaintDto
  ) {
    return this.allegationComplaintService.update(
      id,
      updateAllegationComplaintDto
    );
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
