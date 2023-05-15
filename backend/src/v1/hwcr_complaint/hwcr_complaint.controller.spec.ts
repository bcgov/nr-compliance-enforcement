import { Test, TestingModule } from '@nestjs/testing';
import { HwcrComplaintController } from './hwcr_complaint.controller';
import { HwcrComplaintService } from './hwcr_complaint.service';
import { ComplaintService } from '../complaint/complaint.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Complaint } from '../complaint/entities/complaint.entity';
import { HwcrComplaint } from './entities/hwcr_complaint.entity';

describe('HwcrComplaintController', () => {
  let controller: HwcrComplaintController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HwcrComplaintController],
      providers: [
        HwcrComplaintService,
        {
          provide: getRepositoryToken(HwcrComplaint),
          useValue: {},
        },
        ComplaintService,
        {
          provide: getRepositoryToken(Complaint),
          useValue: {},
        },
      ],
      
    }).compile();

    controller = module.get<HwcrComplaintController>(HwcrComplaintController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
