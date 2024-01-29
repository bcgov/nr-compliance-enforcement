import { Test, TestingModule } from '@nestjs/testing';
import { StagingActivityCodeService } from './staging_activity_code.service';

describe('StagingActivityCodeService', () => {
  let service: StagingActivityCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StagingActivityCodeService],
    }).compile();

    service = module.get<StagingActivityCodeService>(StagingActivityCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
