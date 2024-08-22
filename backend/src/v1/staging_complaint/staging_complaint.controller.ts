import { Controller, Post, Body, Param, UseGuards } from "@nestjs/common";
import { StagingComplaintService } from "./staging_complaint.service";
import { ApiTags } from "@nestjs/swagger";
import { WebEOCComplaint } from "../../types/webeoc-complaint";
import { ApiKeyGuard } from "../../auth/apikey.guard";
import { Public } from "../../auth/decorators/public.decorator";
import { WebEOCComplaintUpdate } from "src/types/webeoc-complaint-update";

@ApiTags("staging-complaint")
@Public()
@Controller({
  path: "staging-complaint",
  version: "1",
})
export class StagingComplaintController {
  constructor(private readonly stagingComplaintService: StagingComplaintService) {}

  //--
  //-- createNewComplaint function creates a new entry for a complaint into
  //-- the staging_complaint table
  //-- this does not create a new complaint in the complaint table
  //--
  @Post("/webeoc-complaint")
  @UseGuards(ApiKeyGuard)
  createNewComplaint(@Body() createStagingComplaint: WebEOCComplaint) {
    return this.stagingComplaintService.stageNewComplaint(createStagingComplaint);
  }

  //--
  //-- createComplaintUpdate functioncreates a new entry for a complaint_update
  //-- into the staging_complaint table
  //-- this does not create a new complaint_update in the complaint_update table
  //--
  @Post("/webeoc-complaint-update")
  @UseGuards(ApiKeyGuard)
  createComplaintUpdate(@Body() createStagingComplaint: WebEOCComplaintUpdate) {
    return this.stagingComplaintService.stageUpdateComplaint(createStagingComplaint);
  }

  //--
  //-- processWebEOCComplaint function takes a complaint_id and promotes the complaint from
  //-- the staging table into the complaint table
  //--
  @Post("/process/:complaintIdentifier")
  @UseGuards(ApiKeyGuard)
  async processWebEOCComplaint(@Param("complaintIdentifier") complaintIdentifier: string): Promise<any> {
    return await this.stagingComplaintService.processWebEOCComplaint(complaintIdentifier);
  }

  //--
  //-- processWebEOCComplaintUpdate function takes a complaint_id, and updateNumber and
  //-- promotes the update from the staging table into the complaint_update table
  //--
  @Post("/process/:complaintIdentifier/:updateNumber")
  @UseGuards(ApiKeyGuard)
  async processWebEOCComplaintUpdate(
    @Param("complaintIdentifier") complaintIdentifier: string,
    @Param("updateNumber") updateNumber: string,
  ): Promise<any> {
    const updateNumberAsNumber: number = parseInt(updateNumber, 10);
    return await this.stagingComplaintService.processWebEOCComplaintUpdate(complaintIdentifier, updateNumberAsNumber);
  }
}
