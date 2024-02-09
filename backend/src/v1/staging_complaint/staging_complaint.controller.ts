import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StagingComplaintService } from './staging_complaint.service';
import { ApiTags } from '@nestjs/swagger';
import { WebEOCComplaint } from 'src/types/webeoc-complaint';
import { ApiKeyGuard } from 'src/auth/apikey.guard';
import { Public } from 'src/auth/decorators/public.decorator';

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
  async process(
    @Param("complaintIdentifier") complaintIdentifier: string,
  ): Promise<any> {
    return await this.stagingComplaintService.process(complaintIdentifier);
  }
}
