import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StagingMetaDataMappingService } from './staging_meta_data_mapping.service';
import { CreateStagingMetaDataMappingDto } from './dto/create-staging_meta_data_mapping.dto';
import { UpdateStagingMetaDataMappingDto } from './dto/update-staging_meta_data_mapping.dto';

@Controller('staging-meta-data-mapping')
export class StagingMetaDataMappingController {
  constructor(private readonly stagingMetaDataMappingService: StagingMetaDataMappingService) {}

  @Post()
  create(@Body() createStagingMetaDataMappingDto: CreateStagingMetaDataMappingDto) {
    return this.stagingMetaDataMappingService.create(createStagingMetaDataMappingDto);
  }

  @Get()
  findAll() {
    return this.stagingMetaDataMappingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stagingMetaDataMappingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStagingMetaDataMappingDto: UpdateStagingMetaDataMappingDto) {
    return this.stagingMetaDataMappingService.update(+id, updateStagingMetaDataMappingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stagingMetaDataMappingService.remove(+id);
  }
}
