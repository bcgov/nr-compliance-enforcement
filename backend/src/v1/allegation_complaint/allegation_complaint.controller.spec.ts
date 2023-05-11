import { Test, TestingModule } from '@nestjs/testing';
import { AllegationComplaintController } from './allegation_complaint.controller';
import { AllegationComplaintService } from './allegation_complaint.service';
import { AllegationComplaint } from './entities/allegation_complaint.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe("UserController", () => {
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
      ],
    }).compile();

    controller = module.get<AllegationComplaintController>(AllegationComplaintController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});