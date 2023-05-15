import { Test, TestingModule } from '@nestjs/testing';
import { HwcrComplaintService } from './hwcr_complaint.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HwcrComplaint } from './entities/hwcr_complaint.entity';

describe('HwcrComplaintService', () => {
  let service: HwcrComplaintService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HwcrComplaintService,
        {
          provide: getRepositoryToken(HwcrComplaint),
          useValue: {

          },
        },],
    }).compile();

    service = module.get<HwcrComplaintService>(HwcrComplaintService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
