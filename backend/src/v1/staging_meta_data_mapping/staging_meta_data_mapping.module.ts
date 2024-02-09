import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StagingMetadataMapping } from './entities/staging_meta_data_mapping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StagingMetadataMapping])],
})
export class StagingMetaDataMappingModule {}
