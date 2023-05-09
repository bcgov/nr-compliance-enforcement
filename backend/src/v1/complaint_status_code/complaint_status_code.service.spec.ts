import { Test, TestingModule } from '@nestjs/testing';
import { ComplaintStatusCodeService } from './complaint_status_code.service';

describe('ComplaintStatusCodeService', () => {
  let service: ComplaintStatusCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplaintStatusCodeService],
    }).compile();

    service = module.get<ComplaintStatusCodeService>(ComplaintStatusCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
