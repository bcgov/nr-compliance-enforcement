import { Test, TestingModule } from '@nestjs/testing';
import { AllegationComplaintController } from './allegation_complaint.controller';
import { AllegationComplaintService } from './allegation_complaint.service';

describe('AllegationComplaintController', () => {
  let controller: AllegationComplaintController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllegationComplaintController],
      providers: [AllegationComplaintService],
    }).compile();

    controller = module.get<AllegationComplaintController>(AllegationComplaintController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
