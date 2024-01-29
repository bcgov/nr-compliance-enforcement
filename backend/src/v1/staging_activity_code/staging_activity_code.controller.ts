import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StagingActivityCodeService } from './staging_activity_code.service';
import { CreateStagingActivityCodeDto } from './dto/create-staging_activity_code.dto';
import { UpdateStagingActivityCodeDto } from './dto/update-staging_activity_code.dto';

@Controller('staging-activity-code')
export class StagingActivityCodeController {
  constructor(private readonly stagingActivityCodeService: StagingActivityCodeService) {}

  @Post()
  create(@Body() createStagingActivityCodeDto: CreateStagingActivityCodeDto) {
    return this.stagingActivityCodeService.create(createStagingActivityCodeDto);
  }

  @Get()
  findAll() {
    return this.stagingActivityCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stagingActivityCodeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStagingActivityCodeDto: UpdateStagingActivityCodeDto) {
    return this.stagingActivityCodeService.update(+id, updateStagingActivityCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stagingActivityCodeService.remove(+id);
  }
}
