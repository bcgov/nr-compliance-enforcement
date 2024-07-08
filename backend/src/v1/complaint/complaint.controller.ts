import { Controller, Get, Body, Patch, Param, UseGuards, Query, Post, Logger } from "@nestjs/common";
import { ComplaintService } from "./complaint.service";
import { Role } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { COMPLAINT_TYPE } from "../../types/models/complaints/complaint-type";
import { WildlifeComplaintDto } from "../../types/models/complaints/wildlife-complaint";
import { AllegationComplaintDto } from "../../types/models/complaints/allegation-complaint";
import { ComplaintDto } from "../../types/models/complaints/complaint";
import { ComplaintSearchParameters } from "../../types/models/complaints/complaint-search-parameters";
import { ZoneAtAGlanceStats } from "src/types/zone_at_a_glance/zone_at_a_glance_stats";
import { GeneralIncidentComplaintDto } from "src/types/models/complaints/gir-complaint";

@UseGuards(JwtRoleGuard)
@ApiTags("complaint")
@Controller({
  path: "complaint",
  version: "1",
})
export class ComplaintController {
  constructor(private readonly service: ComplaintService) {}
  private readonly logger = new Logger(ComplaintController.name);

  @Get(":complaintType")
  @Roles(Role.COS_OFFICER)
  async findAllByType(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
  ): Promise<Array<WildlifeComplaintDto | AllegationComplaintDto>> {
    return await this.service.findAllByType(complaintType);
  }

  @Get("/map/search/:complaintType")
  @Roles(Role.COS_OFFICER)
  mapSearch(@Param("complaintType") complaintType: COMPLAINT_TYPE, @Query() model: ComplaintSearchParameters) {
    return this.service.mapSearch(complaintType, model);
  }

  @Get("/search/:complaintType")
  @Roles(Role.COS_OFFICER)
  search(@Param("complaintType") complaintType: COMPLAINT_TYPE, @Query() model: ComplaintSearchParameters) {
    return this.service.search(complaintType, model);
  }

  @Patch("/update-status-by-id/:id")
  @Roles(Role.COS_OFFICER)
  async updateComplaintStatusById(@Param("id") id: string, @Body() model: any): Promise<ComplaintDto> {
    const { status } = model;
    try {
      return await this.service.updateComplaintStatusById(id, status);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Patch("/update-by-id/:complaintType/:id")
  @Roles(Role.COS_OFFICER)
  async updateComplaintById(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
    @Param("id") id: string,
    @Body() model: ComplaintDto | WildlifeComplaintDto | AllegationComplaintDto | GeneralIncidentComplaintDto,
  ): Promise<WildlifeComplaintDto | AllegationComplaintDto | GeneralIncidentComplaintDto> {
    return await this.service.updateComplaintById(id, complaintType, model);
  }

  @Get("/by-complaint-identifier/:complaintType/:id")
  @Roles(Role.COS_OFFICER)
  async findComplaintById(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
    @Param("id") id: string,
  ): Promise<WildlifeComplaintDto | AllegationComplaintDto | GeneralIncidentComplaintDto> {
    return (await this.service.findById(id, complaintType)) as
      | WildlifeComplaintDto
      | AllegationComplaintDto
      | GeneralIncidentComplaintDto;
  }

  @Post("/create/:complaintType")
  @Roles(Role.COS_OFFICER)
  async create(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
    @Body() model: WildlifeComplaintDto | AllegationComplaintDto,
  ): Promise<WildlifeComplaintDto | AllegationComplaintDto> {
    return await this.service.create(complaintType, model);
  }

  @Get("/stats/:complaintType/by-zone/:zone")
  @Roles(Role.COS_OFFICER)
  statsByZone(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
    @Param("zone") zone: string,
  ): Promise<ZoneAtAGlanceStats> {
    return this.service.getZoneAtAGlanceStatistics(complaintType, zone);
  }
}
