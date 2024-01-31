import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StagingComplaintService } from './staging_complaint.service';
import { UpdateStagingComplaintDto } from './dto/update-staging_complaint.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { WebEOCComplaint } from 'src/types/webeoc-complaint';

@ApiTags("staging-complaint")
@Controller({
  path: "staging-complaint",
  version: "1",
})
export class StagingComplaintController {
  constructor(private readonly stagingComplaintService: StagingComplaintService) {}

  @Post()
  @Public()
  create(@Body() createStagingComplaint: WebEOCComplaint) {
    return this.stagingComplaintService.create(createStagingComplaint);
  }

  @Get()
  findAll() {
    return this.stagingComplaintService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stagingComplaintService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStagingComplaintDto: UpdateStagingComplaintDto) {
    return this.stagingComplaintService.update(+id, updateStagingComplaintDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stagingComplaintService.remove(+id);
  }
}
