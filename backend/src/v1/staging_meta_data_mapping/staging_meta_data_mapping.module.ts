import { Module } from '@nestjs/common';
import { StagingMetaDataMappingService } from './staging_meta_data_mapping.service';
import { StagingMetaDataMappingController } from './staging_meta_data_mapping.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StagingMetadataMapping } from './entities/staging_meta_data_mapping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StagingMetadataMapping])],
  controllers: [StagingMetaDataMappingController],
  providers: [StagingMetaDataMappingService]
})
export class StagingMetaDataMappingModule {}
