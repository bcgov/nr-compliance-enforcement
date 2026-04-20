import { Controller, Get, Body, Patch, Param, UseGuards, Query, Post, Logger, Request, Response } from "@nestjs/common";
import { ComplaintService } from "./complaint.service";
import { Role, coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Token } from "../../auth/decorators/token.decorator";
import { ApiTags } from "@nestjs/swagger";
import { COMPLAINT_TYPE } from "../../types/models/complaints/complaint-type";
import { WildlifeComplaintDto } from "../../types/models/complaints/dtos/wildlife-complaint";
import { AllegationComplaintDto } from "../../types/models/complaints/dtos/allegation-complaint";
import { ComplaintDto } from "../../types/models/complaints/dtos/complaint";
import {
  ComplaintSearchParameters,
  ComplaintMapSearchClusteredParameters,
} from "../../types/models/complaints/complaint-search-parameters";
import { ZoneAtAGlanceStats } from "../../types/zone_at_a_glance/zone_at_a_glance_stats";

import { ApiKeyGuard } from "../../auth/apikey.guard";
import { ActionTaken } from "../../types/models/complaints/action-taken";
import { Public } from "../../auth/decorators/public.decorator";
import { StagingComplaintService } from "../staging_complaint/staging_complaint.service";
import { ComplaintDtoAlias } from "../../types/models/complaints/dtos/complaint-dto-alias";

import { RelatedDataDto } from "../../types/models/complaints/dtos/related-data";
import { ACTION_TAKEN_ACTION_TYPES } from "../../types/constants";
import { LinkedComplaintXrefService } from "../linked_complaint_xref/linked_complaint_xref.service";
import { getAgenciesFromRoles } from "../../common/methods";
import { AppUserComplaintXrefService } from "../app_user_complaint_xref/app_user_complaint_xref.service";
import { UUID } from "node:crypto";
import { SendCollaboratorEmalDto } from "../../v1/email/dto/send_collaborator_email.dto";
import { User } from "../../auth/decorators/user.decorator";
import { SectorComplaintDto } from "src/types/models/complaints/dtos/sector-complaint";
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
    private readonly appUserComplaintXrefService: AppUserComplaintXrefService,
  ) {}
  private readonly logger = new Logger(ComplaintController.name);

  @Get("/sector-complaints-by-ids")
  @Roles(coreRoles)
  async findSectorComplaintsByIds(
    @Query("ids") complaintIds: string[],
    @Token() token: string,
  ): Promise<SectorComplaintDto[]> {
    return await this.service.getSectorComplaintsByIds(complaintIds, token);
  }

  @Get(":complaintType")
  @Roles(coreRoles)
  async findAllByType(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
  ): Promise<Array<WildlifeComplaintDto | AllegationComplaintDto>> {
    return await this.service.findAllByType(complaintType);
  }

  /*   @Get("/map/search/:complaintType")
  @Roles(Role.COS, Role.CEEB)
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
  @Roles(coreRoles)
  mapSearchClustered(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
    @Query() model: ComplaintMapSearchClusteredParameters,
    @Request() req,
    @Token() token,
  ) {
    const roles = getAgenciesFromRoles(req.user.client_roles);
    return this.service.mapSearchClustered(complaintType, model, roles, token);
  }

  @Get("/search/:complaintType")
  @Roles(coreRoles)
  async search(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
    @Query() model: ComplaintSearchParameters,
    @Request() req,
    @Token() token,
  ) {
    const roles = getAgenciesFromRoles(req.user.client_roles);
    const result = await this.service.search(complaintType, model, roles, token);
    return result;
  }

  @Patch("/update-status-by-id/:id")
  @Roles(coreRoles)
  async updateComplaintStatusById(
    @Param("id") id: string,
    @Body() model: any,
    @Token() token: string,
  ): Promise<ComplaintDto> {
    const { status } = model;
    try {
      return await this.service.updateComplaintStatusById(id, status, token);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Patch("/update-by-id/:complaintType/:id")
  @Roles(coreRoles)
  async updateComplaintById(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
    @Param("id") id: string,
    @Body() model: ComplaintDtoAlias,
    @Token() token: string,
  ): Promise<ComplaintDtoAlias> {
    return await this.service.updateComplaintById(id, complaintType, model, token);
  }

  @Patch("/update-date-by-id/:id")
  @Roles(coreRoles)
  async updateComplaintLastUpdatedDateById(@Param("id") id: string): Promise<boolean> {
    return await this.service.updateComplaintLastUpdatedDate(id);
  }

  @Get("/by-complaint-identifier/:complaintType/:id")
  @Roles(coreRoles)
  async findComplaintById(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
    @Param("id") id: string,
    @Request() req,
    @Response() res,
    @Token() token: string,
  ): Promise<ComplaintDtoAlias> {
    const result = (await this.service.findById(id, complaintType, req, token)) as ComplaintDtoAlias;
    if (!result) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    return res.status(200).json(result);
  }

  @Get("/related-data/:id")
  @Roles(coreRoles)
  async findRelatedDataById(@Param("id") id: string): Promise<RelatedDataDto> {
    return await this.service.findRelatedDataById(id);
  }

  @Post("/create/:complaintType")
  @Roles(coreRoles)
  async create(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
    @Body() model: ComplaintDtoAlias,
  ): Promise<ComplaintDtoAlias> {
    return await this.service.create(complaintType, model);
  }

  @Get("/stats/:complaintType/by-zone/:zone")
  @Roles(coreRoles)
  statsByZone(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
    @Param("zone") zone: string,
    @Token() token: string,
  ): Promise<ZoneAtAGlanceStats> {
    return this.service.getZoneAtAGlanceStatistics(complaintType, zone, token);
  }

  @Get("/linked-complaints/:complaint_id/related")
  @Roles(coreRoles)
  async findAllRelatedComplaints(@Param("complaint_id") complaintId: string) {
    return await this.linkedComplaintXrefService.findAllRelatedComplaints(complaintId);
  }

  @Get("/linked-complaints/:complaint_id")
  @Roles(coreRoles)
  async findDirectLinkedComplaints(@Param("complaint_id") complaintId: string) {
    return await this.linkedComplaintXrefService.findDirectLinks(complaintId);
  }

  @Post("/link-complaints")
  @Roles(coreRoles)
  async linkComplaints(
    @Body()
    linkComplaintDto: {
      parentComplaintId: string;
      childComplaintId: string;
      linkType: string;
    },
    @User() user: any,
    @Token() token: string,
  ) {
    return await this.linkedComplaintXrefService.linkComplaints(
      linkComplaintDto.parentComplaintId,
      linkComplaintDto.childComplaintId,
      linkComplaintDto.linkType,
      user,
      token,
    );
  }

  @Post("/unlink-complaints")
  @Roles(coreRoles)
  async unlinkComplaints(
    @Body()
    unlinkComplaintDto: {
      complaintId: string;
      linkedComplaintId: string;
    },
    @User() user: any,
  ) {
    return await this.linkedComplaintXrefService.unlinkComplaints(
      unlinkComplaintDto.complaintId,
      unlinkComplaintDto.linkedComplaintId,
      user,
    );
  }

  // Collaborator routes
  @Post("/:complaint_id/add-collaborator/:app_user_guid")
  @Roles(coreRoles)
  async addCollaborator(
    @Param("complaint_id") complaintId: string,
    @Param("app_user_guid") appUserGuid: string,
    @Body() sendCollaboratorEmailDto: SendCollaboratorEmalDto,
    @User() user,
    @Token() token,
  ) {
    return await this.appUserComplaintXrefService.addCollaboratorToComplaint(
      complaintId,
      appUserGuid,
      sendCollaboratorEmailDto,
      user,
      token,
    );
  }

  @Patch("/:complaint_id/remove-collaborator/:app_user_complaint_xref_guid")
  @Roles(coreRoles)
  async removeCollaborator(
    @Param("complaint_id") complaintId: string,
    @Param("app_user_complaint_xref_guid") appUserComplaintXrefGuid: UUID,
  ) {
    return await this.appUserComplaintXrefService.removeCollaboratorFromComplaint(
      complaintId,
      appUserComplaintXrefGuid,
    );
  }

  @Get("/:complaint_id/collaborators")
  @Roles(coreRoles) // Might want to expose this to others in the future instead of just making it coupled to HWCRs
  async getComplaintCollaborators(@Param("complaint_id") complaintId: string, @Token() token: string) {
    return await this.appUserComplaintXrefService.getCollaborators(complaintId, token);
  }
  // End of Collaborator routes

  @Public()
  @Post("/staging/action-taken")
  @UseGuards(ApiKeyGuard)
  async stageActionTaken(@Body() action: ActionTaken) {
    return await this.stagingService.stageObject("ACTION-TAKEN", action);
  }

  @Public()
  @Post("/staging/action-taken-update")
  @UseGuards(ApiKeyGuard)
  async stageActionTakenUpdate(@Body() action: ActionTaken) {
    return await this.stagingService.stageObject("ACTION-TAKEN-UPDATE", action);
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
