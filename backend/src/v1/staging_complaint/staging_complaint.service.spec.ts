import { Test, TestingModule } from '@nestjs/testing';
import { StagingComplaintService } from './staging_complaint.service';

describe('StagingComplaintService', () => {
  let service: StagingComplaintService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StagingComplaintService],
    }).compile();

    service = module.get<StagingComplaintService>(StagingComplaintService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
