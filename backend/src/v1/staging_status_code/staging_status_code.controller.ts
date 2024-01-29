import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StagingStatusCodeService } from './staging_status_code.service';
import { CreateStagingStatusCodeDto } from './dto/create-staging_status_code.dto';
import { UpdateStagingStatusCodeDto } from './dto/update-staging_status_code.dto';

@Controller('staging-status-code')
export class StagingStatusCodeController {
  constructor(private readonly stagingStatusCodeService: StagingStatusCodeService) {}

  @Post()
  create(@Body() createStagingStatusCodeDto: CreateStagingStatusCodeDto) {
    return this.stagingStatusCodeService.create(createStagingStatusCodeDto);
  }

  @Get()
  findAll() {
    return this.stagingStatusCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stagingStatusCodeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStagingStatusCodeDto: UpdateStagingStatusCodeDto) {
    return this.stagingStatusCodeService.update(+id, updateStagingStatusCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stagingStatusCodeService.remove(+id);
  }
}
