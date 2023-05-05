import { Test, TestingModule } from '@nestjs/testing';
import { ComplaintService } from './complaint.service';

describe('ComplaintService', () => {
  let service: ComplaintService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplaintService],
    }).compile();

    service = module.get<ComplaintService>(ComplaintService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
