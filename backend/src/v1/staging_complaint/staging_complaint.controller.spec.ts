import { Test, TestingModule } from '@nestjs/testing';
import { StagingComplaintController } from './staging_complaint.controller';
import { StagingComplaintService } from './staging_complaint.service';

describe('StagingComplaintController', () => {
  let controller: StagingComplaintController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StagingComplaintController],
      providers: [StagingComplaintService],
    }).compile();

    controller = module.get<StagingComplaintController>(StagingComplaintController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
