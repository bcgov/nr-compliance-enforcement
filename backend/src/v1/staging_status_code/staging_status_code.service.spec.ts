import { Test, TestingModule } from '@nestjs/testing';
import { StagingStatusCodeService } from './staging_status_code.service';

describe('StagingStatusCodeService', () => {
  let service: StagingStatusCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StagingStatusCodeService],
    }).compile();

    service = module.get<StagingStatusCodeService>(StagingStatusCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
