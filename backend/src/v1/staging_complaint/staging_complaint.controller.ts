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

  @Post("/creates")
  @UseGuards(ApiKeyGuard)
  createNewComplaint(@Body() createStagingComplaint: WebEOCComplaint) {
    return this.stagingComplaintService.createNewComplaint(createStagingComplaint);
  }

  @Post("/updates")
  @UseGuards(ApiKeyGuard)
  createComplaintUpdate(@Body() createStagingComplaint: WebEOCComplaintUpdate) {
    return this.stagingComplaintService.createComplaintUpdate(createStagingComplaint);
  }

  @Post("/process/:complaintIdentifier")
  @UseGuards(ApiKeyGuard)
  async process(@Param("complaintIdentifier") complaintIdentifier: string): Promise<any> {
    return await this.stagingComplaintService.process(complaintIdentifier);
  }
}
