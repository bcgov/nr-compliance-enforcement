import { Controller, Get, Body, Patch, Param, UseGuards, Query, Post, Logger, Request } from "@nestjs/common";
import { ComplaintService } from "./complaint.service";
import { Role, coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Token } from "../../auth/decorators/token.decorator";
import { ApiTags } from "@nestjs/swagger";
import { COMPLAINT_TYPE } from "../../types/models/complaints/complaint-type";
import { WildlifeComplaintDto } from "../../types/models/complaints/dtos/wildlife-complaint";
import { AllegationComplaintDto } from "../../types/models/complaints/dtos/allegation-complaint";
import { GeneralIncidentComplaintDto } from "../../types/models/complaints/dtos/gir-complaint";
import { SectorComplaintDto } from "src/types/models/complaints/dtos/sector-complaint";
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
import { dtoAlias } from "../../types/models/complaints/dtos/dtoAlias-type";

import { RelatedDataDto } from "../../types/models/complaints/dtos/related-data";
import { ACTION_TAKEN_ACTION_TYPES } from "../../types/constants";
import { LinkedComplaintXrefService } from "../linked_complaint_xref/linked_complaint_xref.service";
import { getAgenciesFromRoles } from "../../common/methods";
import { PersonComplaintXrefService } from "../person_complaint_xref/person_complaint_xref.service";
import { UUID } from "crypto";
import { SendCollaboratorEmalDto } from "../../v1/email/dto/send_collaborator_email.dto";
import { User } from "../../auth/decorators/user.decorator";
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
    private readonly personComplaintXrefService: PersonComplaintXrefService,
  ) {}
  private readonly logger = new Logger(ComplaintController.name);

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
  async updateComplaintStatusById(@Param("id") id: string, @Body() model: any): Promise<ComplaintDto> {
    const { status } = model;
    try {
      return await this.service.updateComplaintStatusById(id, status);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Patch("/update-by-id/:complaintType/:id")
  @Roles(coreRoles)
  async updateComplaintById(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
    @Param("id") id: string,
    @Body() model: ComplaintDto | WildlifeComplaintDto | AllegationComplaintDto | GeneralIncidentComplaintDto,
  ): Promise<dtoAlias> {
    return await this.service.updateComplaintById(id, complaintType, model);
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
  ): Promise<dtoAlias> {
    return (await this.service.findById(id, complaintType)) as dtoAlias;
  }
  @Get("/related-data/:id")
  @Roles(coreRoles)
  async findRelatedDataById(@Param("id") id: string): Promise<RelatedDataDto> {
    return await this.service.findRelatedDataById(id);
  }

  @Post("/create/:complaintType")
  @Roles(coreRoles)
  async create(@Param("complaintType") complaintType: COMPLAINT_TYPE, @Body() model: dtoAlias): Promise<dtoAlias> {
    return await this.service.create(complaintType, model);
  }

  @Get("/stats/:complaintType/by-zone/:zone")
  @Roles(coreRoles)
  statsByZone(
    @Param("complaintType") complaintType: COMPLAINT_TYPE,
    @Param("zone") zone: string,
  ): Promise<ZoneAtAGlanceStats> {
    return this.service.getZoneAtAGlanceStatistics(complaintType, zone);
  }

  @Get("/linked-complaints/:complaint_id")
  @Roles(Role.COS, Role.PARKS) // Might want to expose this to others in the future instead of just making it coupled to HWCRs
  async findLinkedComplaintsById(@Param("complaint_id") complaintId: string) {
    const childComplaints = await this.linkedComplaintXrefService.findChildComplaints(complaintId);
    if (childComplaints.length > 0) return childComplaints;
    else {
      const parentComplaint = await this.linkedComplaintXrefService.findParentComplaint(complaintId);
      return parentComplaint;
    }
  }

  // Collaborator routes
  @Post("/:complaint_id/add-collaborator/:person_guid")
  @Roles(coreRoles)
  async addCollaborator(
    @Param("complaint_id") complaintId: string,
    @Param("person_guid") personGuid: string,
    @Body() sendCollaboratorEmailDto: SendCollaboratorEmalDto,
    @User() user,
  ) {
    return await this.personComplaintXrefService.addCollaboratorToComplaint(
      complaintId,
      personGuid,
      sendCollaboratorEmailDto,
      user,
    );
  }

  @Patch("/:complaint_id/remove-collaborator/:person_complaint_xref_guid")
  @Roles(coreRoles)
  async removeCollaborator(
    @Param("complaint_id") complaintId: string,
    @Param("person_complaint_xref_guid") personComplaintXrefGuid: UUID,
  ) {
    return await this.personComplaintXrefService.removeCollaboratorFromComplaint(complaintId, personComplaintXrefGuid);
  }

  @Get("/:complaint_id/collaborators")
  @Roles(coreRoles) // Might want to expose this to others in the future instead of just making it coupled to HWCRs
  async getComplaintCollaborators(@Param("complaint_id") complaintId: string) {
    return await this.personComplaintXrefService.getCollaborators(complaintId);
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
