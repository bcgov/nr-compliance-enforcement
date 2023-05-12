import { Test, TestingModule } from '@nestjs/testing';
import { AllegationComplaintController } from './allegation_complaint.controller';
import { AllegationComplaintService } from './allegation_complaint.service';
import { AllegationComplaint } from './entities/allegation_complaint.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ComplaintService } from '../complaint/complaint.service';
import { Complaint } from '../complaint/entities/complaint.entity';

describe("AllegationComplaintController", () => {
  let controller: AllegationComplaintController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllegationComplaintController],
      providers: [
        AllegationComplaintService,
        {
          provide: getRepositoryToken(AllegationComplaint),
          useValue: {},
        },
        ComplaintService,
        {
          provide: getRepositoryToken(Complaint),
          useValue: {},
        },
      ],
      
    }).compile();

    controller = module.get<AllegationComplaintController>(AllegationComplaintController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});