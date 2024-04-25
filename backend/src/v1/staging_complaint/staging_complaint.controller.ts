import { Controller, Post, Body, Param, UseGuards } from "@nestjs/common";
import { StagingComplaintService } from "./staging_complaint.service";
import { ApiTags } from "@nestjs/swagger";
import { WebEOCComplaint } from "../../types/webeoc-complaint";
import { ApiKeyGuard } from "../../auth/apikey.guard";
import { Public } from "../../auth/decorators/public.decorator";

@ApiTags("staging-complaint")
@Public()
@Controller({
  path: "staging-complaint",
  version: "1",
})
export class StagingComplaintController {
  constructor(private readonly stagingComplaintService: StagingComplaintService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body() createStagingComplaint: WebEOCComplaint) {
    return this.stagingComplaintService.create(createStagingComplaint);
  }

  @Post("/process/:complaintIdentifier")
  @UseGuards(ApiKeyGuard)
  async process(@Param("complaintIdentifier") complaintIdentifier: string): Promise<any> {
    return await this.stagingComplaintService.process(complaintIdentifier);
  }
}
