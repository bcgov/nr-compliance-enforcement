import { Test, TestingModule } from '@nestjs/testing';
import { StagingComplaintsApiServiceService } from './staging-complaints-api-service.service';

describe('StagingComplaintsApiServiceService', () => {
  let service: StagingComplaintsApiServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StagingComplaintsApiServiceService],
    }).compile();

    service = module.get<StagingComplaintsApiServiceService>(StagingComplaintsApiServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
