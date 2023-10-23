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
  Req,
} from "@nestjs/common";
import { HwcrComplaintService } from "./hwcr_complaint.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UUID } from "crypto";
import { SearchPayload } from "../complaint/models/search-payload";

@UseGuards(JwtRoleGuard)
@ApiBearerAuth()
@ApiTags("hwcr-complaint")
@Controller({
  path: "hwcr-complaint",
  version: "1",
})
export class HwcrComplaintController {
  constructor(private readonly hwcrComplaintService: HwcrComplaintService) {}

  private readonly logger = new Logger(HwcrComplaintController.name);

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body("hwcrComplaint") createHwcrComplaintDto: string) {
    return this.hwcrComplaintService.create(createHwcrComplaintDto);
  }

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll(
    @Query("sortColumn") sortColumn: string,
    @Query("sortOrder") sortOrder: string
  ) {
    return this.hwcrComplaintService.findAll(sortColumn, sortOrder);
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
    @Query("natureOfComplaint") natureOfComplaint: string,
    @Query("speciesCode") speciesCode: string,
    @Query("incidentReportedStart") incidentReportedStart: Date,
    @Query("incidentReportedEnd") incidentReportedEnd: Date,
    @Query("status") status,
    @Query("page") page: number,
    @Query("pageSize") pageSize: number,
    @Query("query") query: string,
  ) {
    console.log("page: ", page)
    return this.hwcrComplaintService.search(
      sortColumn,
      sortOrder,
      community,
      zone,
      region,
      officerAssigned,
      natureOfComplaint,
      speciesCode,
      incidentReportedStart,
      incidentReportedEnd,
      status,
      page,
      pageSize,
      query
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
    @Query("natureOfComplaint") natureOfComplaint: string,
    @Query("speciesCode") speciesCode: string,
    @Query("incidentReportedStart") incidentReportedStart: Date,
    @Query("incidentReportedEnd") incidentReportedEnd: Date,
    @Query("status") status
  ) {
    return this.hwcrComplaintService.searchMap(
      sortColumn,
      sortOrder,
      community,
      zone,
      region,
      officerAssigned,
      natureOfComplaint,
      speciesCode,
      incidentReportedStart,
      incidentReportedEnd,
      status
    );
  }

  @Get(":id")
  @Roles(Role.COS_OFFICER)
  findOne(@Param("id") id: string) {
    return this.hwcrComplaintService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.COS_OFFICER)
  async update(
    @Param("id") id: UUID,
    @Body("hwcrComplaint") updateHwcrComplaintDto: string
  ) {
    const hwcrComplaint = await this.hwcrComplaintService.update(
      id,
      updateHwcrComplaintDto
    );
    return hwcrComplaint;
  }

  @Delete(":id")
  @Roles(Role.COS_OFFICER)
  remove(@Param("id") id: UUID) {
    return this.hwcrComplaintService.remove(id);
  }

  @Get("/by-complaint-identifier/:id")
  @Roles(Role.COS_OFFICER)
  byId(@Param("id") id: string) {
    return this.hwcrComplaintService.findByComplaintIdentifier(id);
  }

  @Get("/stats/by-zone/:zone")
  @Roles(Role.COS_OFFICER)
  statsByZone(@Param("zone") zone: string) {
    return this.hwcrComplaintService.getZoneAtAGlanceStatistics(zone);
  }
}
