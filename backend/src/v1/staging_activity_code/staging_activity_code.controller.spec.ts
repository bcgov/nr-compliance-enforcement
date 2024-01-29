import { Test, TestingModule } from '@nestjs/testing';
import { StagingActivityCodeController } from './staging_activity_code.controller';
import { StagingActivityCodeService } from './staging_activity_code.service';

describe('StagingActivityCodeController', () => {
  let controller: StagingActivityCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StagingActivityCodeController],
      providers: [StagingActivityCodeService],
    }).compile();

    controller = module.get<StagingActivityCodeController>(StagingActivityCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
