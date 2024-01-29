import { PartialType } from '@nestjs/swagger';
import { CreateStagingMetaDataMappingDto } from './create-staging_meta_data_mapping.dto';

export class UpdateStagingMetaDataMappingDto extends PartialType(CreateStagingMetaDataMappingDto) {}
