import { Injectable } from '@nestjs/common';
import { CreateStagingMetaDataMappingDto } from './dto/create-staging_meta_data_mapping.dto';
import { UpdateStagingMetaDataMappingDto } from './dto/update-staging_meta_data_mapping.dto';

@Injectable()
export class StagingMetaDataMappingService {
  create(createStagingMetaDataMappingDto: CreateStagingMetaDataMappingDto) {
    return 'This action adds a new stagingMetaDataMapping';
  }

  findAll() {
    return `This action returns all stagingMetaDataMapping`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stagingMetaDataMapping`;
  }

  update(id: number, updateStagingMetaDataMappingDto: UpdateStagingMetaDataMappingDto) {
    return `This action updates a #${id} stagingMetaDataMapping`;
  }

  remove(id: number) {
    return `This action removes a #${id} stagingMetaDataMapping`;
  }
}
