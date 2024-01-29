import { Test, TestingModule } from '@nestjs/testing';
import { StagingMetaDataMappingController } from './staging_meta_data_mapping.controller';
import { StagingMetaDataMappingService } from './staging_meta_data_mapping.service';

describe('StagingMetaDataMappingController', () => {
  let controller: StagingMetaDataMappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StagingMetaDataMappingController],
      providers: [StagingMetaDataMappingService],
    }).compile();

    controller = module.get<StagingMetaDataMappingController>(StagingMetaDataMappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
