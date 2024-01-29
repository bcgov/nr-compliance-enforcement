import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StagingComplaintService } from './staging_complaint.service';
import { CreateStagingComplaintDto } from './dto/create-staging_complaint.dto';
import { UpdateStagingComplaintDto } from './dto/update-staging_complaint.dto';

@Controller('staging-complaint')
export class StagingComplaintController {
  constructor(private readonly stagingComplaintService: StagingComplaintService) {}

  @Post()
  create(@Body() createStagingComplaintDto: CreateStagingComplaintDto) {
    return this.stagingComplaintService.create(createStagingComplaintDto);
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
