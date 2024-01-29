import { Test, TestingModule } from '@nestjs/testing';
import { StagingMetaDataMappingService } from './staging_meta_data_mapping.service';

describe('StagingMetaDataMappingService', () => {
  let service: StagingMetaDataMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StagingMetaDataMappingService],
    }).compile();

    service = module.get<StagingMetaDataMappingService>(StagingMetaDataMappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
