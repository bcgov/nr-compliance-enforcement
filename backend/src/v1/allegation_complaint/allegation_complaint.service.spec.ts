import { Test, TestingModule } from '@nestjs/testing';
import { AllegationComplaintService } from './allegation_complaint.service';

describe('AllegationComplaintService', () => {
  let service: AllegationComplaintService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllegationComplaintService],
    }).compile();

    service = module.get<AllegationComplaintService>(AllegationComplaintService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
