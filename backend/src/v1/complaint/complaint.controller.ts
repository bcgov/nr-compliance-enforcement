import { Controller, Get, Body, Patch, Param, UseGuards, Query, Post, Logger, Request } from "@nestjs/common";
import { ComplaintService } from "./complaint.service";
import { Role } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Token } from "../../auth/decorators/token.decorator";
import { ApiTags } from "@nestjs/swagger";
import { COMPLAINT_TYPE } from "../../types/models/complaints/complaint-type";
import { WildlifeComplaintDto } from "../../types/models/complaints/wildlife-complaint";
import { AllegationComplaintDto } from "../../types/models/complaints/allegation-complaint";
import { ComplaintDto } from "../../types/models/complaints/complaint";
import {
  ComplaintSearchParameters,
  ComplaintMapSearchClusteredParameters,
} from "../../types/models/complaints/complaint-search-parameters";
import { ZoneAtAGlanceStats } from "src/types/zone_at_a_glance/zone_at_a_glance_stats";
import { GeneralIncidentComplaintDto } from "src/types/models/complaints/gir-complaint";
import { ApiKeyGuard } from "src/auth/apikey.guard";
import { ActionTaken } from "../../types/models/complaints/action-taken";
import { Public } from "src/auth/decorators/public.decorator";
import { StagingComplaintService } from "../staging_complaint/staging_complaint.service";
import { dtoAlias } from "../../types/models/complaints/dtoAlias-type";

import { RelatedDataDto } from "src/types/models/complaints/related-data";
import { ACTION_TAKEN_ACTION_TYPES } from "src/types/constants";
import { hasRole } from "src/common/has-role";
import { LinkedComplaintXrefService } from "../linked_complaint_xref/linked_complaint_xref.service";

@UseGuards(JwtRoleGuard)
@ApiTags("complaint")
@Controller({
  path: "complaint",
  version: "1",
})
export class ComplaintController {
  constructor(
    private readonly service: ComplaintService,
    private readonly stagingService: StagingComplaintService,
    private readonly linkedComplaintXrefService: LinkedComplaintXrefService,
  ) {}
  private readonly logger = new Logger(ComplaintController.name);

  @Get(":complaintType")
  @Roles(Role.COS_OFFICER, Role.CEEB)
  async findAllByType(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
  ): Promise<Array<WildlifeComplaintDto | AllegationComplaintDto>> {
    return await this.service.findAllByType(complaintType);
  }

  /*   @Get("/map/search/:complaintType")
  @Roles(Role.COS_OFFICER, Role.CEEB)
  mapSearch(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
    @Query() model: ComplaintSearchParameters,
    @Request() req,
    @Token() token,
  ) {
    const hasCEEBRole = hasRole(req, Role.CEEB);

    return this.service.mapSearch(complaintType, model, hasCEEBRole, token);
  } */

  @Get("/map/search/clustered/:complaintType")
  @Roles(Role.COS_OFFICER, Role.CEEB)
  mapSearchClustered(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
    @Query() model: ComplaintMapSearchClusteredParameters,
    @Request() req,
    @Token() token,
  ) {
    const hasCEEBRole = hasRole(req, Role.CEEB);

    return this.service.mapSearchClustered(complaintType, model, hasCEEBRole, token);
  }

  @Get("/search/:complaintType")
  @Roles(Role.COS_OFFICER, Role.CEEB)
  async search(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
    @Query() model: ComplaintSearchParameters,
    @Request() req,
    @Token() token,
  ) {
    const hasCEEBRole = hasRole(req, Role.CEEB);
    const result = await this.service.search(complaintType, model, hasCEEBRole, token);
    return result;
  }

  @Patch("/update-status-by-id/:id")
  @Roles(Role.COS_OFFICER, Role.CEEB)
  async updateComplaintStatusById(@Param("id") id: string, @Body() model: any): Promise<ComplaintDto> {
    const { status } = model;
    try {
      return await this.service.updateComplaintStatusById(id, status);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Patch("/update-by-id/:complaintType/:id")
  @Roles(Role.COS_OFFICER, Role.CEEB)
  async updateComplaintById(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
    @Param("id") id: string,
    @Body() model: ComplaintDto | WildlifeComplaintDto | AllegationComplaintDto | GeneralIncidentComplaintDto,
  ): Promise<dtoAlias> {
    return await this.service.updateComplaintById(id, complaintType, model);
  }

  @Get("/by-complaint-identifier/:complaintType/:id")
  @Roles(Role.COS_OFFICER, Role.CEEB)
  async findComplaintById(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
    @Param("id") id: string,
  ): Promise<dtoAlias> {
    return (await this.service.findById(id, complaintType)) as
      | WildlifeComplaintDto
      | AllegationComplaintDto
      | GeneralIncidentComplaintDto;
  }
  @Get("/related-data/:id")
  @Roles(Role.COS_OFFICER, Role.CEEB)
  async findRelatedDataById(@Param("id") id: string): Promise<RelatedDataDto> {
    return await this.service.findRelatedDataById(id);
  }

  @Post("/create/:complaintType")
  @Roles(Role.COS_OFFICER, Role.CEEB)
  async create(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
    @Body() model: WildlifeComplaintDto | AllegationComplaintDto,
  ): Promise<WildlifeComplaintDto | AllegationComplaintDto> {
    return await this.service.create(complaintType, model);
  }

  @Get("/stats/:complaintType/by-zone/:zone")
  @Roles(Role.COS_OFFICER, Role.CEEB)
  statsByZone(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
    @Param("zone") zone: string,
  ): Promise<ZoneAtAGlanceStats> {
    return this.service.getZoneAtAGlanceStatistics(complaintType, zone);
  }

  @Get("/linked-complaints/:complaint_id")
  @Roles(Role.COS_OFFICER)
  async findLinkedComplaintsById(@Param("complaint_id") complaintId: string) {
    const childComplaints = await this.linkedComplaintXrefService.findChildComplaints(complaintId);
    if (childComplaints.length > 0) return childComplaints;
    else {
      const parentComplaint = await this.linkedComplaintXrefService.findParentComplaint(complaintId);
      return parentComplaint;
    }
  }

  @Public()
  @Post("/staging/action-taken")
  @UseGuards(ApiKeyGuard)
  stageActionTaken(@Body() action: ActionTaken) {
    this.stagingService.stageObject("ACTION-TAKEN", action);
  }

  @Public()
  @Post("/staging/action-taken-update")
  @UseGuards(ApiKeyGuard)
  stageActionTakenUpdate(@Body() action: ActionTaken) {
    this.stagingService.stageObject("ACTION-TAKEN-UPDATE", action);
  }

  @Public()
  @Post("/process/action-taken/:id")
  @UseGuards(ApiKeyGuard)
  processActionTaken(@Param("id") id: string, @Body() payload: any) {
    const { dataid } = payload;
    this.stagingService.processObject(ACTION_TAKEN_ACTION_TYPES.CREATE_ACTION_TAKEN, id, dataid);
  }

  @Public()
  @Post("/process/action-taken-update/:id")
  @UseGuards(ApiKeyGuard)
  processActionTakenUpdate(@Param("id") id: string, @Body() payload: any) {
    const { dataid } = payload;
    this.stagingService.processObject(ACTION_TAKEN_ACTION_TYPES.UPDATE_ACTION_TAKEN, id, dataid);
  }
}
